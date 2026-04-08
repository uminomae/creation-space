# OCR: Feynman (1948) Space-Time Approach to Non-Relativistic Quantum Mechanics

- source_id: D02-S01
- method: Claude Vision (pdftoppm 300dpi PNG → Claude Read)
- date: 2026-04-08
- pages: 21 (pp. 367-387)
- journal: Reviews of Modern Physics, Vol. 20, No. 2, April 1948

---

## Structure

1. Introduction (p. 367)
2. The Superposition of Probability Amplitudes (pp. 368-369)
3. The Probability Amplitude for a Space-Time Path (pp. 370-371)
4. The Calculation of the Probability Amplitude for a Path (pp. 371-372)
5. Definition of the Wave Function (pp. 372-373)
6. The Wave Equation (pp. 374-376)
7. Discussion of the Wave Equation — The Classical Limit (pp. 377-378)
8. Operator Algebra — Matrix Elements (pp. 379-381)
9. Newton's Equations — The Commutation Relation (pp. 380-381)
10. The Hamiltonian — Momentum (pp. 382-383)
11. Inadequacies of the Formulation (p. 384)
12. A Possible Generalization (pp. 384-385)
13. Application to Eliminate Field Oscillators (pp. 385-386)
14. Statistical Mechanics — Spin and Relativity (pp. 386-387)

---

## Key Content Summary (from OCR)

### 1. Introduction

Feynman presents a third formulation of non-relativistic quantum mechanics, alongside Schroedinger's differential equation and Heisenberg's matrix algebra. This formulation was suggested by Dirac's remarks concerning the relation of classical action to quantum mechanics. A probability amplitude is associated with an entire motion of a particle as a function of time, rather than simply with a position of the particle at a particular time. The formulation is mathematically equivalent to the more usual formulations.

### 2. The Superposition of Probability Amplitudes

The general concept of the superposition of probability amplitudes in quantum mechanics is discussed. The probability amplitude P_ab for an event that can happen in several alternative ways is the absolute square of a sum of complex contributions, one from each alternative way.

Key equation: P_ab = P_ac * P_cb (Eq. 1)

If measurement B gives result b, then measurement C gives c, the probability that if measurement B gives b, then C gives c is P_bc. The events between a and b are independent of those between b and c.

### 3. The Probability Amplitude for a Space-Time Path

The physical ideas of the previous section are extended to define a probability amplitude for a particular completely specified motion — a space-time path. The probability of a particle being found in a region R of space-time is the absolute square of a sum of complex contributions, one from each path in the region.

Key equation (Eq. 8):
P(x_{k+1}, ..., x_1, x_0; dx_{k+1}, ..., dx_1, dx_0) integrates over all paths

The "ideal measurement" concept: the probability amplitude φ(R) for region R is defined as:
φ(R) = Lim ∫...∫ exp(i/ℏ Σ S(x_{i+1}, x_i)) dx_i/A (Eq. 9)

### 4. The Calculation of the Probability Amplitude for a Path

The first postulate prescribes the type of mathematical framework: the calculation of probabilities. The second postulate gives a particular content:

**If the paths contribute equally in magnitude, but the phase of their contribution is the classical action (in units of ℏ); i.e., the time integral of the Lagrangian taken along the path.**

The contribution φ[x(t)] from a given path is proportional to exp(iS[x(t)]/ℏ), where the action S[x(t)] = ∫L(ẋ(t), x(t), t)dt.

For a free particle:
S(x_{i+1}, x_i) = m(x_{i+1} - x_i)²/(2ε) (Eq. 19-22)

### 5. Definition of the Wave Function

The wave function is defined through the path integral formulation. The wave function ψ(x,t) at time t is related to the probability amplitude by integration over all paths arriving at point x at time t.

Key relation: ψ and χ separate past and future information.

ψ(x, t) contains all information needed to predict future probabilities. The wave function is sufficient to define those attributes left from past history which determine future behavior.

### 6. The Wave Equation

The equivalence with the ordinary formulation of quantum mechanics is proved. The wave function satisfies Schroedinger's differential wave equation.

From the path integral, for small ε:
ψ(x, t+ε) = ∫ exp(iS(x, x_i)/ℏ) ψ(x_i, t) dx_i/A (Eq. 18)

This leads to Schroedinger's equation:
iℏ ∂ψ/∂t = -(ℏ²/2m)∂²ψ/∂x² + V(x)ψ (Eq. 27-28)

Detailed derivation for the free particle using Gaussian integrals (Eqs. 23-26), showing the normalization factor A = (2πiℏε/m)^(1/2).

### 7. Discussion of the Wave Equation — The Classical Limit

**The Classical Limit**: The development of the wave function during a small time interval ε is easily interpreted physically as the expression of Huygens' principle for matter waves. In geometrical optics this is Fermat's principle of least time.

Huygens' principle: each contribution is delayed in phase by an amount proportional to the time it takes light from the surface to the point along the ray of least time of geometrical optics.

The path integral formulation is analogous to Hamilton's first principle of least action for classical mechanics. The amplitude of the wave φ is known as a "surface," in particular the "surface" consisting of all at a time t. As t→t+ε, contributions from all points of the surface at t interfere. Each contribution is delayed in phase by an amount proportional to the action.

### 8. Operator Algebra — Matrix Elements

The transition element is defined:
⟨x'|F|x⟩_S = Lim ∫...∫ F·exp(iS/ℏ) ∏dx_i/A (Eq. 38-39)

where F is a functional of the path x(t).

Key result: transition elements such as (39) are important insofar as F may arise from a change δS in the action expression — observable functionals.

The relation of the path integral to conventional operator formalism is established. The operator exp(-iHε/ℏ) corresponds to the propagator over time ε.

### 9. Newton's Equations — The Commutation Relation

From the path integral formulation, Newton's equations of motion and the commutation relations emerge:

**The commutation relation**: px - xp = ℏ/i

This is derived by showing that two different functionals give the same transition element (Eq. 46). The order of terms in a matrix operator product corresponds to an order in time of the corresponding factors in a functional.

### 10. The Hamiltonian — Momentum

The Hamiltonian operator is of central importance. The Hamiltonian functional H_t is defined:
H_t = δS(x_{t+ε}, x_t; x_{t-ε}, x_{t-2ε}) / δε (Eq. 58)

The kinetic energy functional:
K.E. = ½m[(x_{t+ε} - x_t)/ε]²·ℏ/2εi (Eq. 52)

The momentum functional p_t is defined considering changes made by displacements of position.

### 11. Inadequacies of the Formulation

The formulation suffers from a serious drawback: it requires an unnatural and cumbersome subdivision of time interval to make the meaning of the equations clear. It was thought best to avoid this in a first presentation.

### 12. A Possible Generalization

The formulation suggests a generalization for classical problems where the action cannot be written as an integral of a function of positions and velocities, e.g., when the action involves the product of coordinates at two different times (such as ∫x(t)x(t+T)dt). In such cases, no wave function is available to describe a state.

### 13. Application to Eliminate Field Oscillators

One characteristic of the present formulation: it gives a bird's eye view of the space-time relationships in a given situation. The oscillators of the electromagnetic field can be eliminated by performing the Gaussian integrations, giving rise to the retarded (and advanced) interaction between particles.

Key result: The transition amplitude with oscillators eliminated gives the quantity G_mn (Eq. 64), which contains the coordinates of the particle only.

### 14. Statistical Mechanics — Spin and Relativity

**Statistical Mechanics**: The statistical density matrix has a path integral representation obtained by replacing exp(iS/ℏ) with exp(-S/kT).

**Spin**: Can be included in a formal way via the Pauli spin equation, replacing the vector potential term in S.

**Relativity**: The Klein-Gordon relativistic equation can be obtained by adding a fourth coordinate to specify a "path." The Dirac equation results from a modification of the Lagrangian used for the Klein-Gordon equation. However, these results for spin and relativity are purely formal.

---

## Notable Equations

- Eq. 1: P_ab = P_ac · P_cb (probability superposition)
- Eq. 9: φ(R) = Lim ∫exp(iΣS/ℏ)∏dx/A (path integral)
- Eq. 11: S(x_{i+1}, x_i) = classical action for one step
- Eq. 18: ψ(x,t+ε) = ∫exp(iS/ℏ)ψ dx/A (wave equation derivation)
- Eq. 27-28: Schroedinger equation derived from path integral
- Eq. 38-39: Transition element definition
- Eq. 46: ∂F/∂x · δS/δx equivalence (commutation relation)
- Eq. 58: Hamiltonian functional definition

## Acknowledgments

The author thanks Professor and Mrs. H. C. Corben and Professor H. A. Bethe, and especially Professor J. A. Wheeler for many discussions during the early stages of the work.
