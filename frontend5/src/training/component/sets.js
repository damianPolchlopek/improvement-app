// Wspólne operacje na seriach ćwiczenia (widok treningów i formularz dodawania).

// "5/5/5" + "50/50/55" -> [{ reps: '5', weight: '50' }, ...]; null dla wartości z jednostkami
// (kardio: "5 km", "12 km/h") albo gdy liczba serii w powtórzeniach i ciężarze się różni.
export function toSets(reps, weight) {
  const repsParts = String(reps ?? '')
    .split('/')
    .map((part) => part.trim());
  const weightParts = String(weight ?? '')
    .split('/')
    .map((part) => part.trim());
  const isNumber = (part) => part !== '' && Number.isFinite(Number(part));
  if (
    repsParts.length !== weightParts.length ||
    !repsParts.every(isNumber) ||
    !weightParts.every(isNumber)
  ) {
    return null;
  }
  return repsParts.map((r, i) => ({ reps: r, weight: weightParts[i] }));
}

// Średni ciężar ze wszystkich serii (zwykła średnia, bez ważenia powtórzeniami).
export const averageWeight = (exercise) => {
  const sets = exercise && toSets(exercise.reps, exercise.weight);
  return sets ? sets.reduce((sum, set) => sum + Number(set.weight), 0) / sets.length : null;
};

// Zaokrąglenie do 0,1 kg – także po to, by błędy zmiennoprzecinkowe nie dawały fałszywych ▲/▼.
export const roundKg = (value) => Math.round(value * 10) / 10;

// Zmiana średniego ciężaru (kg, zaokrąglona do 0,1) albo null, gdy nie da się porównać.
export function weightChange(current, previous) {
  const now = averageWeight(current);
  const before = averageWeight(previous);
  return now == null || before == null ? null : roundKg(now - before);
}

export const formatSets = (reps, weight) =>
  toSets(reps, weight)
    ?.map((set) => `${set.reps}×${set.weight}`)
    .join(', ') ?? `${reps} · ${weight}`;
