import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Colores consistentes para los gráficos
const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899', '#14b8a6'];

// Datos de muestra por tipo de gráfica (para demo)
export const sampleLineData = [
  { name: 'Ene', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 500 },
  { name: 'Abr', value: 280 },
  { name: 'May', value: 590 },
  { name: 'Jun', value: 320 },
];

export const sampleMultiLineData = [
  { name: 'Ene', completed: 240, active: 140 },
  { name: 'Feb', completed: 180, active: 120 },
  { name: 'Mar', completed: 350, active: 150 },
  { name: 'Abr', completed: 250, active: 30 },
  { name: 'May', completed: 400, active: 190 },
  { name: 'Jun', completed: 280, active: 40 },
];

export const sampleBarData = [
  { name: 'Central', value: 42 },
  { name: 'Norte', value: 31 },
  { name: 'Sur', value: 15 },
  { name: 'Este', value: 7 },
  { name: 'Oeste', value: 5 },
];

export const samplePieData = [
  { name: 'Dry Van', value: 50 },
  { name: 'Flatbed', value: 25 },
  { name: 'Refrigerated', value: 15 },
  { name: 'Container', value: 10 },
];

export const sampleAreaData = [
  { name: 'Ene', value: 20 },
  { name: 'Feb', value: 35 },
  { name: 'Mar', value: 30 },
  { name: 'Abr', value: 45 },
  { name: 'May', value: 50 },
  { name: 'Jun', value: 55 },
];

interface SimpleLineChartProps {
  data: { name: string; value: number }[];
  color?: string;
  height?: number;
  xKey?: string;
  yKey?: string;
  grid?: boolean;
  gradientId?: string;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  data,
  color = '#3b82f6',
  height = 300,
  xKey = 'name',
  yKey = 'value',
  grid = true,
  gradientId = 'colorValue',
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0.2} />
          </linearGradient>
        </defs>
        {grid && <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />}
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={{ stroke: '#d1d5db' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={{ stroke: '#d1d5db' }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Line
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2}
          dot={{ stroke: color, strokeWidth: 2, r: 4, fill: 'white' }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

interface MultiLineChartProps {
  data: any[];
  height?: number;
  lines: { dataKey: string; stroke: string; name?: string }[];
  grid?: boolean;
}

export const MultiLineChart: React.FC<MultiLineChartProps> = ({
  data,
  height = 300,
  lines,
  grid = true,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {grid && <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />}
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={{ stroke: '#d1d5db' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={{ stroke: '#d1d5db' }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Legend />
        {lines.map((line, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.stroke}
            strokeWidth={2}
            name={line.name || line.dataKey}
            dot={{ stroke: line.stroke, strokeWidth: 2, r: 4, fill: 'white' }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

interface SimpleBarChartProps {
  data: { name: string; value: number }[];
  height?: number;
  color?: string;
  grid?: boolean;
  xKey?: string;
  yKey?: string;
  horizontal?: boolean;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  height = 300,
  color = '#3b82f6',
  grid = true,
  xKey = 'name',
  yKey = 'value',
  horizontal = false,
}) => {
  const gradientId = `barGradient-${color.replace('#', '')}`;
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0.4} />
          </linearGradient>
        </defs>
        {grid && <CartesianGrid strokeDasharray="3 3" opacity={0.3} />}
        
        {horizontal ? (
          <>
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={false}
            />
            <YAxis
              dataKey={xKey}
              type="category"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={false}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={false}
            />
          </>
        )}
        
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Bar
          dataKey={yKey}
          fill={`url(#${gradientId})`}
          radius={[4, 4, 0, 0]}
          barSize={horizontal ? 20 : 30}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

interface SimplePieChartProps {
  data: { name: string; value: number }[];
  height?: number;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  label?: boolean;
}

export const SimplePieChart: React.FC<SimplePieChartProps> = ({
  data,
  height = 300,
  colors = COLORS,
  innerRadius = 60,
  outerRadius = 90,
  label = true,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={label}
          label={label ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : undefined}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [value, 'Valor']}
          contentStyle={{
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

interface SimpleAreaChartProps {
  data: { name: string; value: number }[];
  height?: number;
  color?: string;
  grid?: boolean;
  xKey?: string;
  yKey?: string;
}

export const SimpleAreaChart: React.FC<SimpleAreaChartProps> = ({
  data,
  height = 300,
  color = '#3b82f6',
  grid = true,
  xKey = 'name',
  yKey = 'value',
}) => {
  const gradientId = `areaGradient-${color.replace('#', '')}`;
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        {grid && <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />}
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={{ stroke: '#d1d5db' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={{ stroke: '#d1d5db' }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Area
          type="monotone"
          dataKey={yKey}
          stroke={color}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};