"""Render the source geometries for inspection; does not invent or smooth borders."""
from pathlib import Path
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon

root = Path(__file__).resolve().parents[1]
data = json.loads((root/'src/data/modernHistoricalBoundaries.json').read_text())['features']
roman = json.loads((root/'src/data/romanBoundaries.json').read_text())
fig, axes = plt.subplots(1, 3, figsize=(14, 6), layout='constrained')
for ax in axes:
    ax.set_aspect(1/0.89)
    ax.set_xlabel('Longitude E')
    ax.set_ylabel('Latitude N')
    ax.grid(alpha=.2)

def draw(ax, code, start, color, label, hatch=None):
    f=next(f for f in data if f['properties']['code']==code and f['properties']['start']==start)
    polygons=[f['geometry']['coordinates']] if f['geometry']['type']=='Polygon' else f['geometry']['coordinates']
    for n,p in enumerate(polygons):
        ax.add_patch(Polygon(p[0],facecolor=color,edgecolor=color,alpha=.32,hatch=hatch,label=label if n==0 else None))

draw(axes[0],625,19340720,'purple','Sudan: joint administration')
draw(axes[0],651,19251206,'green','Egypt, 1935')
axes[0].set(xlim=(21,39),ylim=(3,33),title='Separate territories in 1935')
draw(axes[1],651,19670610,'green','Egyptian control, 1968')
draw(axes[1],'sinai-1968',19680101,'darkorange','Occupied Sinai, 1968','///')
axes[1].set(xlim=(24,37),ylim=(21,33),title='Control is distinct from sovereignty')
for f in roman['roman200-eastern-boundary']:
    x,y=zip(*f['geometry']['coordinates']);axes[2].plot(x,y,color='brown',label='Eastern province line, c. 200 CE')
for i,f in enumerate(roman['roman-post-diocletian']):
    x,y=zip(*f['geometry']['coordinates']);axes[2].plot(x,y,color='slategray',ls='--',label='Internal lines, after Diocletian' if i==0 else None)
axes[2].set(xlim=(28,35),ylim=(27,33),title='Separate dated administrative line sets')
for ax in axes: ax.legend(fontsize=8,loc='lower left')
fig.suptitle('Boundary geometry checks — separate snapshots, not a single historical map')
fig.text(.5,-.015,'Sources: CShapes / Schvitz et al., via fullpuri (CC BY-NC-SA 4.0); AWMC (ODbL 1.0). Generalized data.',ha='center',fontsize=9)
fig.savefig(root/'research/boundary-geometry-check.png',dpi=140,bbox_inches='tight')

fig.savefig(root/'research/boundary-geometry-check.svg',bbox_inches='tight')
