import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Play, RotateCcw, Settings2, Share2 } from 'lucide-react';
import * as d3 from 'd3';

interface VisualizerProps {
  data: any;
}

export const Visualizer = ({ data }: VisualizerProps) => {
  const { type, title, elements, chartType, chartData, variables, logic, description, nodes, links } = data;

  if (type === 'chart') {
    return (
      <div className="my-6 p-6 bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden">
        {title && <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-widest">{title}</h4>}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={10} tick={{ fill: '#9ca3af' }} />
                <YAxis fontSize={10} tick={{ fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
              </LineChart>
            ) : chartType === 'bar' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={10} tick={{ fill: '#9ca3af' }} />
                <YAxis fontSize={10} tick={{ fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
        {description && <p className="mt-4 text-xs text-gray-500 font-medium leading-relaxed italic">{description}</p>}
      </div>
    );
  }

  if (type === 'interactive') {
    return <InteractiveSimulation data={data} />;
  }

  if (type === 'conceptMap') {
    return <ConceptMap nodes={nodes} links={links} title={title} description={description} />;
  }

  if (type === 'diagram') {
    return (
      <div className="my-6 p-6 bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden">
        {title && <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-widest">{title}</h4>}
        <div className="relative aspect-video w-full bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
          <svg viewBox="0 0 400 225" className="w-full h-full">
            {elements?.map((el: any, i: number) => {
              if (el.type === 'rect') {
                return (
                  <g key={i}>
                    <rect 
                      x={el.x} y={el.y} width={el.width} height={el.height} 
                      fill={el.color || '#eff6ff'} stroke={el.stroke || '#2563eb'} strokeWidth="2" rx={el.rx || "4"}
                    />
                    {el.label && (
                      <text x={el.x + el.width/2} y={el.y + el.height/2} textAnchor="middle" dominantBaseline="middle" fontSize={el.fontSize || "10"} fontWeight="bold" fill={el.textColor || "#1e40af"}>
                        {el.label}
                      </text>
                    )}
                  </g>
                );
              }
              if (el.type === 'circle') {
                return (
                  <g key={i}>
                    <circle 
                      cx={el.x} cy={el.y} r={el.r} 
                      fill={el.color || '#eff6ff'} stroke={el.stroke || '#2563eb'} strokeWidth="2"
                    />
                    {el.label && (
                      <text x={el.x} y={el.y} textAnchor="middle" dominantBaseline="middle" fontSize={el.fontSize || "10"} fontWeight="bold" fill={el.textColor || "#1e40af"}>
                        {el.label}
                      </text>
                    )}
                  </g>
                );
              }
              if (el.type === 'line') {
                return (
                  <line 
                    key={i} x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2} 
                    stroke={el.color || '#94a3b8'} strokeWidth={el.strokeWidth || "2"} strokeDasharray={el.dashed ? '4 4' : '0'}
                  />
                );
              }
              if (el.type === 'arrow') {
                return (
                  <g key={i}>
                    <defs>
                      <marker id={`arrowhead-${i}`} markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill={el.color || '#2563eb'} />
                      </marker>
                    </defs>
                    <line 
                      x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2} 
                      stroke={el.color || '#2563eb'} strokeWidth={el.strokeWidth || "2"} markerEnd={`url(#arrowhead-${i})`}
                    />
                  </g>
                );
              }
              if (el.type === 'text') {
                return (
                  <text 
                    key={i} x={el.x} y={el.y} textAnchor={el.anchor || "middle"} dominantBaseline="middle" 
                    fontSize={el.fontSize || "10"} fontWeight={el.bold ? "bold" : "normal"} fill={el.color || "#1e40af"}
                  >
                    {el.label}
                  </text>
                );
              }
              if (el.type === 'path') {
                return (
                  <path 
                    key={i} d={el.d} fill={el.fill || "none"} stroke={el.stroke || "#2563eb"} 
                    strokeWidth={el.strokeWidth || "2"} strokeDasharray={el.dashed ? '4 4' : '0'}
                  />
                );
              }
              return null;
            })}
          </svg>
        </div>
        {description && <p className="mt-4 text-xs text-gray-500 font-medium leading-relaxed italic">{description}</p>}
      </div>
    );
  }

  return null;
};

const ConceptMap = ({ nodes, links, title, description }: { nodes: any[], links: any[], title?: string, description?: string }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !nodes || !links) return;

    const width = 400;
    const height = 300;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    node.append("rect")
      .attr("width", (d: any) => (d.id.length * 8) + 30)
      .attr("height", 36)
      .attr("x", (d: any) => -((d.id.length * 8) + 30) / 2)
      .attr("y", -18)
      .attr("rx", 18)
      .attr("fill", (d: any) => d.color || "#eff6ff")
      .attr("stroke", "#2563eb")
      .attr("stroke-width", 2);

    node.append("text")
      .text((d: any) => d.id)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "11px")
      .attr("font-weight", "bold")
      .attr("fill", "#1e40af");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => { simulation.stop(); };
  }, [nodes, links]);

  return (
    <div className="my-6 p-6 bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          {title && <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{title}</h4>}
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Interactive Concept Map</p>
        </div>
        <Share2 className="w-4 h-4 text-gray-300" />
      </div>
      <div className="relative aspect-[4/3] w-full bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden cursor-grab active:cursor-grabbing">
        <svg ref={svgRef} viewBox="0 0 400 300" className="w-full h-full" />
      </div>
      {description && <p className="mt-4 text-xs text-gray-500 font-medium leading-relaxed italic">{description}</p>}
    </div>
  );
};

const InteractiveSimulation = ({ data }: { data: any }) => {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(data.variables.map((v: any) => [v.id, v.default || v.min]))
  );
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const requestRef = useRef<number>(null);

  const animate = (t: number) => {
    setTime(prev => prev + 0.05);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isPlaying]);

  const result = useMemo(() => {
    try {
      if (data.logic === 'projectile') {
        const { v0, angle } = values;
        const g = 9.81;
        const rad = (angle * Math.PI) / 180;
        const t_flight = (2 * v0 * Math.sin(rad)) / g;
        const range = (v0 * v0 * Math.sin(2 * rad)) / g;
        const h_max = (v0 * v0 * Math.pow(Math.sin(rad), 2)) / (2 * g);
        
        const trajectory = [];
        for (let t = 0; t <= t_flight; t += t_flight / 50) {
          trajectory.push({
            x: v0 * t * Math.cos(rad),
            y: v0 * t * Math.sin(rad) - 0.5 * g * t * t
          });
        }
        return { trajectory, range, h_max, t_flight };
      }
      
      if (data.logic === 'ohm') {
        const { v, r } = values;
        const i = v / r;
        return { i };
      }

      if (data.logic === 'pendulum') {
        const { length, g, initialAngle } = values;
        const omega = Math.sqrt(g / length);
        const theta = initialAngle * Math.cos(omega * time);
        const x = length * Math.sin(theta);
        const y = length * Math.cos(theta);
        return { x, y, theta };
      }

      if (data.logic === 'wave') {
        const { amplitude, frequency, wavelength } = values;
        const k = (2 * Math.PI) / wavelength;
        const omega = 2 * Math.PI * frequency;
        const points = [];
        for (let x = 0; x <= 400; x += 5) {
          points.push({
            x,
            y: amplitude * Math.sin(k * x - omega * time)
          });
        }
        return { points };
      }

      if (data.logic === 'circuit') {
        const { v, r1, r2, type } = values;
        const r_total = type === 0 ? (r1 + r2) : (1 / (1/r1 + 1/r2));
        const i_total = v / r_total;
        return { r_total, i_total };
      }

      if (data.logic === 'spring') {
        const { k, mass, amplitude } = values;
        const omega = Math.sqrt(k / mass);
        const y = amplitude * Math.cos(omega * time);
        return { y };
      }

      if (data.logic === 'lens') {
        const { f, u, h0 } = values;
        const v = (f * u) / (u - f);
        const hi = -(v / u) * h0;
        return { v, hi };
      }

      return null;
    } catch (e) {
      return null;
    }
  }, [values, data.logic, time]);

  return (
    <div className="my-6 p-8 bg-white border border-gray-100 rounded-[40px] shadow-xl shadow-blue-500/5 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-lg font-bold text-gray-900 tracking-tight">{data.title || 'Interactive Concept'}</h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Live Simulation</p>
        </div>
        <div className="flex items-center gap-2">
          {['projectile', 'pendulum', 'wave', 'spring'].includes(data.logic) && (
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
            >
              {isPlaying ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          )}
          <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
            <Settings2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          {data.variables.map((v: any) => (
            <div key={v.id} className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{v.label}</label>
                <span className="text-sm font-bold text-blue-600 tabular-nums">
                  {values[v.id].toFixed(v.step < 1 ? 2 : 0)}{v.unit}
                </span>
              </div>
              <input 
                type="range" 
                min={v.min} 
                max={v.max} 
                step={v.step || 1} 
                value={values[v.id]} 
                onChange={(e) => setValues(prev => ({ ...prev, [v.id]: parseFloat(e.target.value) }))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[8px] font-bold text-gray-300 uppercase tracking-tighter">
                <span>{v.min}{v.unit}</span>
                <span>{v.max}{v.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
          {data.logic === 'projectile' && result && (
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 relative">
                <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
                  <path 
                    d={`M 0 100 ${result.trajectory.map((p: any) => `L ${p.x * (200/result.range)} ${100 - p.y * (100/result.h_max)}`).join(' ')}`}
                    fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" opacity="0.3"
                  />
                  <circle 
                    cx={(values.v0 * (isPlaying ? (time % result.t_flight) : 0) * Math.cos(values.angle * Math.PI / 180)) * (200/result.range)} 
                    cy={100 - (values.v0 * (isPlaying ? (time % result.t_flight) : 0) * Math.sin(values.angle * Math.PI / 180) - 0.5 * 9.81 * Math.pow(isPlaying ? (time % result.t_flight) : 0, 2)) * (100/result.h_max)} 
                    r="4" fill="#2563eb" 
                  />
                </svg>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-[8px] font-bold text-gray-400 uppercase mb-1">Max Height</p>
                  <p className="text-sm font-bold text-gray-900">{result.h_max.toFixed(1)}m</p>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-[8px] font-bold text-gray-400 uppercase mb-1">Range</p>
                  <p className="text-sm font-bold text-gray-900">{result.range.toFixed(1)}m</p>
                </div>
              </div>
            </div>
          )}

          {data.logic === 'pendulum' && result && (
            <div className="w-full h-full flex flex-col items-center">
              <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                <line x1="100" y1="0" x2={100 + result.x * 50} y2={result.y * 50} stroke="#94a3b8" strokeWidth="2" />
                <circle cx={100 + result.x * 50} cy={result.y * 50} r="10" fill="#2563eb" />
                <rect x="80" y="0" width="40" height="4" fill="#475569" />
              </svg>
              <div className="mt-4 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Angle</p>
                <p className="text-lg font-bold text-gray-900">{(result.theta * 180 / Math.PI).toFixed(1)}°</p>
              </div>
            </div>
          )}

          {data.logic === 'spring' && result && (
            <div className="w-full h-full flex flex-col items-center">
              <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                <path 
                  d={`M 100 0 ${Array.from({ length: 20 }).map((_, i) => `L ${100 + (i % 2 === 0 ? 10 : -10)} ${(i + 1) * (100 + result.y * 50) / 20}`).join(' ')}`}
                  fill="none" stroke="#94a3b8" strokeWidth="2"
                />
                <rect x="80" y={100 + result.y * 50} width="40" height="40" fill="#2563eb" rx="4" />
                <rect x="50" y="0" width="100" height="4" fill="#475569" />
              </svg>
              <div className="mt-4 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Displacement</p>
                <p className="text-lg font-bold text-gray-900">{result.y.toFixed(2)}m</p>
              </div>
            </div>
          )}

          {data.logic === 'wave' && result && (
            <div className="w-full h-full flex flex-col">
              <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
                <line x1="0" y1="100" x2="400" y2="100" stroke="#e2e8f0" strokeWidth="1" />
                <path 
                  d={`M ${result.points.map(p => `${p.x} ${100 - p.y}`).join(' L ')}`}
                  fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round"
                />
              </svg>
              <div className="mt-4 flex justify-center gap-8">
                <div className="text-center">
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Frequency</p>
                  <p className="text-xs font-bold text-gray-900">{values.frequency} Hz</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Amplitude</p>
                  <p className="text-xs font-bold text-gray-900">{values.amplitude} m</p>
                </div>
              </div>
            </div>
          )}

          {data.logic === 'lens' && result && (
            <div className="w-full h-full flex flex-col">
              <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
                {/* Principal Axis */}
                <line x1="0" y1="100" x2="400" y2="100" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Lens */}
                <path d="M 200 20 Q 220 100 200 180 Q 180 100 200 20" fill="#eff6ff" stroke="#2563eb" strokeWidth="2" opacity="0.5" />
                
                {/* Object */}
                <line x1={200 - values.u * 5} y1="100" x2={200 - values.u * 5} y2={100 - values.h0 * 5} stroke="#10b981" strokeWidth="3" />
                <text x={200 - values.u * 5} y={90 - values.h0 * 5} textAnchor="middle" fontSize="8" fill="#10b981">Object</text>
                
                {/* Image */}
                {Math.abs(result.v) < 1000 && (
                  <>
                    <line 
                      x1={200 + result.v * 5} y1="100" x2={200 + result.v * 5} y2={100 - result.hi * 5} 
                      stroke="#ef4444" strokeWidth="3" strokeDasharray={result.v < 0 ? '4 4' : '0'}
                    />
                    <text x={200 + result.v * 5} y={110 - result.hi * 5} textAnchor="middle" fontSize="8" fill="#ef4444">Image</text>
                  </>
                )}

                {/* Rays */}
                <line x1={200 - values.u * 5} y1={100 - values.h0 * 5} x2="200" y2={100 - values.h0 * 5} stroke="#f59e0b" strokeWidth="1" opacity="0.5" />
                <line x1="200" y1={100 - values.h0 * 5} x2={200 + 40 * 5} y2={100 + (values.h0/values.f * 40 - values.h0) * 5} stroke="#f59e0b" strokeWidth="1" opacity="0.5" />
                <line x1={200 - values.u * 5} y1={100 - values.h0 * 5} x2="200" y2="100" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />
                <line x1="200" y1="100" x2={200 + 40 * 5} y2={100 + (values.h0/values.u * 40) * 5} stroke="#f59e0b" strokeWidth="1" opacity="0.5" />
              </svg>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-white p-2 rounded-xl border border-gray-100 text-center">
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Image Dist (v)</p>
                  <p className="text-xs font-bold text-gray-900">{result.v.toFixed(1)} cm</p>
                </div>
                <div className="bg-white p-2 rounded-xl border border-gray-100 text-center">
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Magnification</p>
                  <p className="text-xs font-bold text-gray-900">{Math.abs(result.v / values.u).toFixed(2)}x</p>
                </div>
              </div>
            </div>
          )}

          {data.logic === 'ohm' && result && (
            <div className="text-center space-y-6">
              <div className="relative w-32 h-32 mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" stroke="#2563eb" strokeWidth="10" 
                    strokeDasharray={`${(result.i / 10) * 283} 283`} strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center transform rotate-90">
                  <span className="text-2xl font-bold text-gray-900">{result.i.toFixed(2)}A</span>
                  <span className="text-[8px] font-bold text-gray-400 uppercase">Current</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium max-w-[150px] mx-auto leading-relaxed">
                As resistance increases, current decreases proportionally.
              </p>
            </div>
          )}

          {data.logic === 'circuit' && result && (
            <div className="w-full h-full flex flex-col items-center">
              <svg viewBox="0 0 200 150" className="w-full h-full">
                {/* Battery */}
                <line x1="20" y1="75" x2="40" y2="75" stroke="#2563eb" strokeWidth="2" />
                <line x1="30" y1="65" x2="30" y2="85" stroke="#2563eb" strokeWidth="4" />
                <line x1="35" y1="70" x2="35" y2="80" stroke="#2563eb" strokeWidth="2" />
                
                {/* Wires */}
                <path d="M 30 65 L 30 20 L 170 20 L 170 130 L 30 130 L 30 85" fill="none" stroke="#94a3b8" strokeWidth="2" />
                
                {/* Resistors */}
                {values.type === 0 ? (
                  <>
                    <rect x="70" y="10" width="30" height="20" fill="white" stroke="#2563eb" strokeWidth="2" />
                    <text x="85" y="25" textAnchor="middle" fontSize="8" fontWeight="bold">R1</text>
                    <rect x="120" y="10" width="30" height="20" fill="white" stroke="#2563eb" strokeWidth="2" />
                    <text x="135" y="25" textAnchor="middle" fontSize="8" fontWeight="bold">R2</text>
                  </>
                ) : (
                  <>
                    <rect x="155" y="40" width="30" height="20" fill="white" stroke="#2563eb" strokeWidth="2" />
                    <text x="170" y="55" textAnchor="middle" fontSize="8" fontWeight="bold">R1</text>
                    <rect x="155" y="80" width="30" height="20" fill="white" stroke="#2563eb" strokeWidth="2" />
                    <text x="170" y="95" textAnchor="middle" fontSize="8" fontWeight="bold">R2</text>
                    <line x1="170" y1="20" x2="170" y2="40" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="170" y1="110" x2="170" y2="130" stroke="#94a3b8" strokeWidth="2" />
                  </>
                )}
              </svg>
              <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                <div className="bg-white p-2 rounded-xl border border-gray-100 text-center">
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Total R</p>
                  <p className="text-xs font-bold text-gray-900">{result.r_total.toFixed(1)}Ω</p>
                </div>
                <div className="bg-white p-2 rounded-xl border border-gray-100 text-center">
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Total I</p>
                  <p className="text-xs font-bold text-gray-900">{result.i_total.toFixed(2)}A</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {data.description && (
        <div className="mt-10 pt-6 border-t border-gray-50 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 font-medium leading-relaxed italic">{data.description}</p>
        </div>
      )}
    </div>
  );
};
