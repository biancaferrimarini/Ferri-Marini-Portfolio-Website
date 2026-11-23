"""Original neutral studio HDRI: dome, large key, fill and rear strip.
No third-party assets. Radiance RGBE, 1024x512, linear radiance.
Run with Python 3 and numpy to regenerate; not needed by the website.
"""
from pathlib import Path
import numpy as np
W,H=1024,512
u=(np.arange(W)+.5)/W
v=(np.arange(H)+.5)/H
phi=(u-.5)*2*np.pi
theta=v*np.pi
x=np.sin(theta[:,None])*np.sin(phi[None,:])
y=np.broadcast_to(np.cos(theta[:,None]),(H,W))
z=np.sin(theta[:,None])*np.cos(phi[None,:])
rgb=np.ones((H,W,3),dtype=np.float64)*.16
rgb+=np.maximum(y,0)[...,None]*.6
# Azimuth measured from +Z (front), in degrees. Large soft sources.
for az,el,width,power in [(45,35,19,9.0),(-55,22,34,1.7),(148,30,16,6.5),(-135,15,24,2.8)]:
 a,e=np.radians([az,el]); direction=[np.sin(a)*np.cos(e),np.sin(e),np.cos(a)*np.cos(e)]
 dot=np.clip(x*direction[0]+y*direction[1]+z*direction[2],-1,1)
 angle=np.arccos(dot);sigma=np.radians(width)
 rgb+=(power*np.exp(-.5*(angle/sigma)**4))[...,None]
bright=rgb.max(axis=2);mant,exp=np.frexp(bright)
scale=mant*256/bright
rgbe=np.zeros((H,W,4),dtype=np.uint8)
rgbe[:,:,:3]=np.clip(rgb*scale[:,:,None],0,255).astype(np.uint8)
rgbe[:,:,3]=(exp+128).astype(np.uint8)
def encode(channel):
 data=channel.tolist();out=bytearray();i=0
 while i<len(data):
  run=1
  while i+run<len(data) and data[i+run]==data[i] and run<127: run+=1
  if run>=4:
   out.extend((128+run,data[i]));i+=run
  else:
   start=i;i+=run
   while i<len(data) and i-start<128:
    run=1
    while i+run<len(data) and data[i+run]==data[i] and run<4: run+=1
    if run>=4: break
    i+=min(run,128-(i-start))
   out.append(i-start);out.extend(data[start:i])
 return bytes(out)

out=Path(__file__).resolve().parents[1]/'assets/environments/ferri-marini-studio.hdr'
with out.open('wb') as f:
 f.write(b'#?RADIANCE\n# Ferri Marini original studio lighting\nFORMAT=32-bit_rle_rgbe\n\n-Y 512 +X 1024\n')
 for row in rgbe:
  f.write(bytes([2,2,W>>8,W&255]))
  for c in range(4): f.write(encode(row[:,c]))
print(out, out.stat().st_size)
