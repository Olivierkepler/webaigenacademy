# Recursion: Build the Full Tree

Finding the root split is only the first step. A decision tree grows by **recursion**—repeating the same split search on every impure child until the tree is finished.

## Big idea

After the root split:

- A **pure** child (all one class) becomes a **leaf** with a prediction.
- An **impure** child is treated like a new mini-dataset—the algorithm runs the same steps again: generate thresholds, score weighted Gini, pick the best split.

This repeats down the tree until every branch ends in a leaf.

## Formula

At each impure node, the tree applies the same rule as the root:

$$
\text{Best split} = \arg\min_{\text{feature},\, t} \;\text{Weighted Gini}
$$

Recursion stops at a node when:

- the node is **pure** (Gini \(= 0\)), or
- a **stopping condition** applies (covered in a later lesson)

## Worked example

On our 8-sample practice dataset, the root split is Feature 0 \(\leq 2.5\):

| Branch | Samples | Result |
|--------|--------:|--------|
| Right (\(x > 2.5\)) | 4 | All class 1 → **leaf**, predict 1 |
| Left (\(x \leq 2.5\)) | 4 | Still mixed → **recurse** |

On the left branch, the tree searches again among the remaining features and thresholds. It may pick Feature 0 \(\leq 1.5\) next, creating one pure leaf and one branch that still needs splitting.

Eventually every path ends in a leaf—some after one split, others after several.

## Common mistake

Thinking the root split alone is the full tree. The root is just the first decision; recursion on impure children builds the rest.

## Key takeaway

Decision trees grow by recursion: find the best split at each impure node, create leaves where groups are pure, and repeat until stopping rules say stop.

Try tracing recursive splits in the practice notebook below.
