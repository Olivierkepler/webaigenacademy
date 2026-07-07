# Gini Impurity

When a decision tree looks at a group of samples, it first asks: *how mixed are the classes here?* Gini impurity answers that question with a single number.

## Big idea

A **node** is a group of training samples waiting for a decision. If every sample has the same class label, the node is **pure**—easy to predict. If classes are mixed together, the node is **impure**—harder to predict.

Gini impurity measures that mixing. Lower Gini means a purer, more predictable node. For two classes, Gini ranges from \(0\) (pure) to \(0.5\) (a perfect 50/50 split).

## Formula

For class proportions \(p_0\) and \(p_1\):

$$
\text{Gini} = 1 - \sum_{i} p_i^2 = 1 - (p_0^2 + p_1^2)
$$

- **Pure node** (all one class): Gini \(= 0\)
- **50/50 split**: Gini \(= 0.5\) (maximum for two classes)

## Worked example

Suppose a node has 6 samples of class 0 and 4 of class 1:

| Node | Class 0 | Class 1 | p0 | p1 | Gini |
|------|--------:|--------:|---:|---:|-----:|
| Mixed | 6 | 4 | 0.6 | 0.4 | 0.48 |
| Pure | 10 | 0 | 1.0 | 0.0 | 0.00 |

For the mixed node:

$$
\text{Gini} = 1 - (p_0^2 + p_1^2) = 1 - (0.6^2 + 0.4^2) = 1 - 0.52 = 0.48
$$

For the pure node:

$$
\text{Gini} = 1 - (1^2 + 0^2) = 0
$$

## Common mistake

Do not confuse Gini impurity with **accuracy**. Gini measures mixing *inside one node* before any split—not how well the whole model performs on test data.

## Key takeaway

Gini impurity tells a decision tree how mixed a node is. Trees prefer splits that create child nodes with lower Gini.

Use the **Gini Impurity Calculator** below to change class counts and watch the score update in real time.
