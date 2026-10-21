class PerlinNoise2D {
  constructor() {
    // 1. Permutationstabelle (Zufällige Anordnung der Zahlen 0-255)
    const p = Array.from({ length: 256 }, (_, i) => i).sort(() => Math.random() - 0.5);
    // Verdoppeln, um Indexüberlauf bei (x + 1) zu vermeiden
    this.permutation = [...p, ...p];
  }

  // 2. Fade-Funktion (Glättungskurve: 6t^5 - 15t^4 + 10t^3)
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  // 3. Lineare Interpolation (Lerp)
  lerp(t, a, b) {
    return a + t * (b - a);
  }

  // 4. Skalarprodukt basierend auf Hash-Wert berechnen
  grad(hash, x, y) {
    // Konvertiert die letzten 3 Bits des Hashs in 8 mögliche Gradientenrichtungen
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  // Hauptfunktion: Gibt Rauschen für eine X/Y-Koordinate zurück
  noise(x, y) {
    // Bestimme die Koordinaten der Gitterzelle (Integer-Ecken)
    let X = Math.floor(x) & 255;
    let Y = Math.floor(y) & 255;

    // Relative Position innerhalb der Zelle (0.0 bis 1.0)
    let xf = x - Math.floor(x);
    let yf = y - Math.floor(y);

    // Glättungsfaktoren berechnen
    let u = this.fade(xf);
    let v = this.fade(yf);

    // Hash-Werte der 4 Ecken der aktuellen Zelle aus der Tabelle holen
    const aa = this.permutation[this.permutation[X] + Y];
    const ab = this.permutation[this.permutation[X] + Y + 1];
    const ba = this.permutation[this.permutation[X + 1] + Y];
    const bb = this.permutation[this.permutation[X + 1] + Y + 1];

    // Skalarprodukte mit den Richtungsvektoren der Ecken berechnen
    const x1 = this.lerp(u, this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf));
    const x2 = this.lerp(u, this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1));

    // Finale Interpolation zwischen den X-Achsen-Ergebnissen
    return this.lerp(v, x1, x2);
  }
}


// --- ANWENDUNGSBEISPIEL ---
const perlin = new PerlinNoise2D();

// Wichtig: Übergib fraktionale Werte (z.B. x * 0.05). 
// Ganze Zahlen landen exakt auf den Gitterpunkten und ergeben meist 0!
for (let x = 0; x < 5; x++) {
  console.log(`Noise bei x=${x*0.1}:`, perlin.noise(x * 0.1, 0.5));
}


