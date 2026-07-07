# Weighted Gini

A single split creates two child groups—a **left** group and a **right** group. Weighted Gini combines their impurity scores into one number the tree can compare.

## Big idea

After a split, each child may have a different Gini score *and* a different number of samples. A tiny but very pure group should not outweigh a large mixed group.

**Weighted Gini** averages the left and right Gini values, giving more weight to the side with more samples. The tree uses this score to judge whether a split is good.

## Formula

$$
\text{Weighted Gini} = \frac{n_{\text{left}}}{n} \cdot \text{Gini}(\text{left}) + \frac{n_{\text{right}}}{n} \cdot \text{Gini}(\text{right})
$$

Here \(n\) is the total number of samples in the parent node, and \(n_{\text{left}}\) and \(n_{\text{right}}\) are the sizes of each child.

Split rules:

- **Left:** samples where \(x \leq t\)
- **Right:** samples where \(x > t\)

## Worked example

On our 8-sample practice dataset, splitting **Feature 0** at threshold \(t = 2.5\) gives:

| Group | Samples | Class Mix | Gini | Weight |
|------|--------:|----------------|-----:|-------:|
| Left (\(x \leq 2.5\)) | 4 | 3 class 0, 1 class 1 | 0.375 | \(4/8 = 0.5\) |
| Right (\(x > 2.5\)) | 4 | 4 class 1 | 0.000 | \(4/8 = 0.5\) |

$$
\text{Weighted Gini}
=
\frac{4}{8}(0.375)
+
\frac{4}{8}(0)
=
0.1875
$$

## Common mistake

Averaging Gini values **without** weighting by sample count. Two children of unequal size need the \(\frac{n_{\text{left}}}{n}\) and \(\frac{n_{\text{right}}}{n}\) factors—otherwise a small group can skew the result.

## Key takeaway

Weighted Gini is how a decision tree scores one candidate split. Lower weighted Gini means the split produced cleaner child groups overall.

Use the **Weighted Gini Calculator** below to adjust left and right class counts and see the weighted score change.
