import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#00a087', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'];

export function PieChart({ data, dataKey = 'value', nameKey = 'name', height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPie>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px'
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
      </RechartsPie>
    </ResponsiveContainer>
  );
}
