import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';

export const C = {
  bg: '#0E1014',
  card: '#181B22',
  cardAlt: '#20242D',
  border: '#2A2F3A',
  text: '#F3F4F6',
  muted: '#9CA3AF',
  accent: '#22C55E',
  accentDim: '#14532D',
  blue: '#3B82F6',
  orange: '#F59E0B',
  red: '#EF4444',
  purple: '#A855F7',
};

export function Screen({ children }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 14 }} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

export function Card({ children, style }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function Title({ children, right }) {
  return (
    <View style={s.titleRow}>
      <Text style={s.title}>{children}</Text>
      {right}
    </View>
  );
}

export function Muted({ children, style }) {
  return <Text style={[s.muted, style]}>{children}</Text>;
}

export function Body({ children, style }) {
  return <Text style={[s.body, style]}>{children}</Text>;
}

export function Stat({ label, value, unit, color = C.text, sub }) {
  return (
    <View style={s.stat}>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={[s.statValue, { color }]}>
        {value}
        {unit ? <Text style={s.statUnit}> {unit}</Text> : null}
      </Text>
      {sub ? <Text style={s.statSub}>{sub}</Text> : null}
    </View>
  );
}

export function Row({ children, style }) {
  return <View style={[{ flexDirection: 'row', gap: 10 }, style]}>{children}</View>;
}

export function Button({ title, onPress, kind = 'primary', style, small }) {
  const bg = kind === 'primary' ? C.accent : kind === 'danger' ? '#3A1515' : C.cardAlt;
  const fg = kind === 'primary' ? '#052e14' : kind === 'danger' ? C.red : C.text;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.btn, small && s.btnSmall, { backgroundColor: bg, opacity: pressed ? 0.75 : 1 }, style]}>
      <Text style={[s.btnText, small && { fontSize: 13 }, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

export function Chip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, active && { backgroundColor: C.accent, borderColor: C.accent }]}>
      <Text style={[s.chipText, active && { color: '#052e14' }]}>{label}</Text>
    </Pressable>
  );
}

export function Chips({ options, value, onChange }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => (
        <Chip key={o.key} label={o.label} active={value === o.key} onPress={() => onChange(o.key)} />
      ))}
    </View>
  );
}

export function Field({ label, value, onChangeText, unit, placeholder, keyboardType = 'decimal-pad', style }) {
  return (
    <View style={[{ flex: 1, gap: 6 }, style]}>
      <Text style={s.fieldLabel}>{label}</Text>
      <View style={s.inputWrap}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#5B6270"
          keyboardType={keyboardType}
          style={s.input}
        />
        {unit ? <Text style={s.inputUnit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

export function ProgressBar({ value, color = C.accent }) {
  const pct = Math.max(0, Math.min(1, value || 0));
  return (
    <View style={s.barTrack}>
      <View style={[s.barFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

export function MacroBar({ protein, carbs, fat }) {
  const pk = protein * 4, ck = carbs * 4, fk = fat * 9;
  const total = pk + ck + fk || 1;
  return (
    <View style={{ gap: 8 }}>
      <View style={[s.barTrack, { flexDirection: 'row', height: 12 }]}>
        <View style={{ flex: pk / total, backgroundColor: C.blue }} />
        <View style={{ flex: ck / total, backgroundColor: C.orange }} />
        <View style={{ flex: fk / total, backgroundColor: C.purple }} />
      </View>
      <Row style={{ justifyContent: 'space-between' }}>
        <Legend color={C.blue} label={`Protein ${protein}g`} />
        <Legend color={C.orange} label={`Carbs ${carbs}g`} />
        <Legend color={C.purple} label={`Fat ${fat}g`} />
      </Row>
    </View>
  );
}

function Legend({ color, label }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />
      <Text style={s.muted}>{label}</Text>
    </View>
  );
}

export function Empty({ children }) {
  return <Text style={[s.muted, { textAlign: 'center', paddingVertical: 16 }]}>{children}</Text>;
}

/** Simple line chart with an optional dashed target line. points: [{ label, value }] */
export function LineChart({ points, target, color = C.accent, height = 180, unit = '' }) {
  const [width, setWidth] = useState(0);
  const pad = { l: 38, r: 12, t: 12, b: 24 };

  if (points.length < 2) {
    return <Empty>Add at least two entries to see your chart.</Empty>;
  }

  const values = points.map((p) => p.value).concat(target != null ? [target] : []);
  let min = Math.min(...values), max = Math.max(...values);
  if (max - min < 1) { min -= 1; max += 1; }
  const range = max - min;
  min -= range * 0.1; max += range * 0.1;

  const w = Math.max(0, width - pad.l - pad.r);
  const h = height - pad.t - pad.b;
  const x = (i) => pad.l + (points.length === 1 ? w / 2 : (i / (points.length - 1)) * w);
  const y = (v) => pad.t + h - ((v - min) / (max - min)) * h;
  const ticks = [max, (max + min) / 2, min];

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ height }}>
      {width > 0 && (
        <Svg width={width} height={height}>
          {ticks.map((t, i) => (
            <Line key={i} x1={pad.l} x2={width - pad.r} y1={y(t)} y2={y(t)} stroke={C.border} strokeWidth={1} />
          ))}
          {ticks.map((t, i) => (
            <SvgText key={`t${i}`} x={pad.l - 6} y={y(t) + 4} fill={C.muted} fontSize="10" textAnchor="end">
              {t.toFixed(1)}
            </SvgText>
          ))}
          {target != null && (
            <>
              <Line x1={pad.l} x2={width - pad.r} y1={y(target)} y2={y(target)} stroke={C.orange} strokeWidth={1.5} strokeDasharray="6,4" />
              <SvgText x={width - pad.r} y={y(target) - 5} fill={C.orange} fontSize="10" textAnchor="end">
                {`Target ${target}${unit}`}
              </SvgText>
            </>
          )}
          <Polyline points={points.map((p, i) => `${x(i)},${y(p.value)}`).join(' ')} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
          {points.map((p, i) => (
            <Circle key={i} cx={x(i)} cy={y(p.value)} r={3.5} fill={color} />
          ))}
          <SvgText x={pad.l} y={height - 6} fill={C.muted} fontSize="10">{points[0].label}</SvgText>
          <SvgText x={width - pad.r} y={height - 6} fill={C.muted} fontSize="10" textAnchor="end">{points[points.length - 1].label}</SvgText>
        </Svg>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 16, padding: 16, gap: 12, borderWidth: 1, borderColor: C.border },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: C.text, fontSize: 18, fontWeight: '700' },
  muted: { color: C.muted, fontSize: 13 },
  body: { color: C.text, fontSize: 15, lineHeight: 21 },
  stat: { flex: 1, backgroundColor: C.cardAlt, borderRadius: 12, padding: 12, gap: 2 },
  statLabel: { color: C.muted, fontSize: 12 },
  statValue: { fontSize: 22, fontWeight: '800' },
  statUnit: { fontSize: 13, fontWeight: '600', color: C.muted },
  statSub: { color: C.muted, fontSize: 11 },
  btn: { borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center' },
  btnSmall: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  btnText: { fontWeight: '700', fontSize: 15 },
  chip: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: C.border, backgroundColor: C.cardAlt },
  chipText: { color: C.text, fontSize: 13, fontWeight: '600' },
  fieldLabel: { color: C.muted, fontSize: 12, fontWeight: '600' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.cardAlt, borderRadius: 10, borderWidth: 1, borderColor: C.border, paddingHorizontal: 12 },
  input: { flex: 1, color: C.text, fontSize: 16, paddingVertical: 10 },
  inputUnit: { color: C.muted, fontSize: 13, marginLeft: 6 },
  barTrack: { height: 10, borderRadius: 999, backgroundColor: C.cardAlt, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 999 },
});
