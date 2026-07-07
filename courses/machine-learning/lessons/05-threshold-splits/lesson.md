# Threshold Splits

For numeric features, a decision tree does not ask "is this value exactly 3?" It asks "is this value **greater than** some cutoff?" That cutoff is the **threshold**.

## Big idea

Each numeric feature is a number line. A threshold \(t\) draws a vertical line on that line: samples on one side go left, samples on the other go right.

To find candidate thresholds, sort the feature's **unique** values and take the **midpoint** between each consecutive pair:

$$
t_i = \frac{v_i + v_{i+1}}{2}
$$

If a feature has \(k\) unique values, there are \(k - 1\) possible thresholds.

## Formula

For feature \(x\) and threshold \(t\):

- **Left group:** \(x \leq t\)
- **Right group:** \(x > t\)

Each threshold produces a left group, a right group, and a weighted Gini:

$$
\text{Weighted Gini} = \frac{n_{\text{left}}}{n} \cdot \text{Gini}(\text{left}) + \frac{n_{\text{right}}}{n} \cdot \text{Gini}(\text{right})
$$

## Worked example

**Feature 0** values in our practice dataset: \((1, 2, 3, 4)\) appearing twice. After sorting and removing duplicates: \(\{1, 2, 3, 4\}\).

Midpoint thresholds:

- \(t_1 = \frac{1 + 2}{2} = 1.5\)
- \(t_2 = \frac{2 + 3}{2} = 2.5\)
- \(t_3 = \frac{3 + 4}{2} = 3.5\)

| Threshold | Weighted Gini | Notes |
|----------:|--------------:|-------|
| 1.5 | 0.208 | |
| 2.5 | 0.1875 | Best for Feature 0 |
| 3.5 | 0.375 | |

Moving the threshold shifts samples between left and right, which changes class counts and the weighted Gini.

## Common mistake

Using raw feature values as thresholds instead of midpoints. If values are \(\{1, 2, 3, 4\}\), the candidates are \(1.5, 2.5, 3.5\)—not \(1, 2, 3,\) or \(4\).

## Key takeaway

Thresholds are midpoints between consecutive unique feature values. Each threshold defines a left/right split that can be scored with weighted Gini.

Use the **Threshold Split Demo** below to pick a feature, move the threshold, and watch the groups update.
