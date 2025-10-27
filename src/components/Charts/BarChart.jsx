import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function BarChart({ data, dataKey, xKey = 'name', height = 300, color = '#00a087' }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBar data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey={xKey} 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px'
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
      </RechartsBar>
    </ResponsiveContainer>
  );
}
