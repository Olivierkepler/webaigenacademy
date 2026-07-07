# Classification Error

Classification error is the simplest impurity measure: what fraction of samples are **not** in the majority class?

## Big idea

If 7 out of 10 samples are class 0, the majority class covers 70%. Classification error is the remaining 30%—the samples that would be misclassified if we guessed the majority class for everyone.

It ranges from \(0\) (pure node) to \(0.5\) for two classes (50/50 split). It is easy to understand, but decision trees rarely use it alone for splitting.

## Formula

$$
\text{Error} = 1 - \max(p_0, p_1, \ldots)
$$

In words: one minus the proportion of the largest class.

## Worked example

| Node composition | Majority share | Classification error |
|------------------|----------------|----------------------|
| 10 class 0, 0 class 1 | 100% | \(0\) |
| 6 class 0, 4 class 1 | 60% | \(0.40\) |
| 5 class 0, 5 class 1 | 50% | \(0.50\) |
| 9 class 0, 1 class 1 | 90% | \(0.10\) |

Now compare the last row to Gini: \(\text{Gini} = 1 - (0.9^2 + 0.1^2) = 0.18\).

Gini and entropy both drop sharply as a node becomes purer. Classification error changes more slowly—it stays at \(0.10\) for any 90/10 split, and does not distinguish a 95/5 split from 90/10 until the majority crosses a new count threshold.

## Common mistake

Assuming "simpler formula = better for splitting." Classification error is less **sensitive** to small improvements near pure nodes, so it can miss splits that Gini or entropy would prefer.

## Key takeaway

Classification error counts non-majority samples. It is intuitive but coarse—Gini and entropy are more responsive guides for the splitting process.

Practice computing classification error for different class distributions in the notebook below.
