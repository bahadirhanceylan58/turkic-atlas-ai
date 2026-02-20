"use client";

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DemographicsData {
    population?: { [year: string]: number };
    ethnicity?: { [group: string]: number };
    religion?: { [group: string]: number };
}

interface DemographicsChartsProps {
    data: DemographicsData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function DemographicsCharts({ data }: DemographicsChartsProps) {
    // Process Population Data safely
    const popData = (data?.population && typeof data.population === 'object' && !Array.isArray(data.population))
        ? Object.entries(data.population).map(([year, count]) => ({
            name: year,
            nüfus: Number(count) || 0
        })).sort((a, b) => parseInt(a.name) - parseInt(b.name))
        : [];

    // Process Ethnicity Data safely
    const ethData = (data?.ethnicity && typeof data.ethnicity === 'object' && !Array.isArray(data.ethnicity))
        ? Object.entries(data.ethnicity).map(([name, value]) => ({ name, value: Number(value) || 0 }))
        : [];

    // Process Religion Data safely
    const relData = (data?.religion && typeof data.religion === 'object' && !Array.isArray(data.religion))
        ? Object.entries(data.religion).map(([name, value]) => ({ name, value: Number(value) || 0 }))
        : [];

    return (
        <div className="space-y-8">
            {/* Population Chart */}
            {popData.length > 0 && (
                <div className="h-48 w-full bg-[var(--surface-bg)] p-4 rounded-lg border border-[var(--border-color)]">
                    <h4 className="text-sm font-bold text-[var(--text-secondary)] mb-2 text-center">Nüfus Değişimi</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={popData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                            <XAxis dataKey="name" stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => value.toLocaleString()} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '12px' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                formatter={(value: any) => value !== undefined && value !== null ? value.toLocaleString() : ''}
                            />
                            <Bar dataKey="nüfus" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Ethnicity & Religion Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ethData.length > 0 && (
                    <div className="h-48 bg-[var(--surface-bg)] p-4 rounded-lg border border-[var(--border-color)]">
                        <h4 className="text-sm font-bold text-[var(--text-secondary)] mb-1 text-center">Etnik Yapı</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ethData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={30}
                                    outerRadius={50}
                                    fill="#8884d8"
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {ethData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: 'var(--text-primary)' }} />
                                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {relData.length > 0 && (
                    <div className="h-48 bg-[var(--surface-bg)] p-4 rounded-lg border border-[var(--border-color)]">
                        <h4 className="text-sm font-bold text-[var(--text-secondary)] mb-1 text-center">Dini Dağılım</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={relData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={30}
                                    outerRadius={50}
                                    fill="#82ca9d"
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {relData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: 'var(--text-primary)' }} />
                                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {(popData.length === 0 && ethData.length === 0 && relData.length === 0) && (
                <div className="text-center text-[var(--text-muted)] py-8 italic">
                    Bu bölge için yeterli grafik verisi oluşturulamadı.
                </div>
            )}
        </div>
    );
}
