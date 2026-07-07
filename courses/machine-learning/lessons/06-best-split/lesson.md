# Build the Root

A decision tree does not pick the first reasonable split—it evaluates **every** candidate and chooses the winner for the **root** node.

## Big idea

The **splitting process** repeats the same recipe at every node:

1. For each feature, generate all midpoint thresholds.
2. For each (feature, threshold) pair, split the data into left and right groups.
3. Compute weighted Gini for that split.
4. Pick the pair with the **smallest** weighted Gini.

That winning split becomes the node's decision. Impure child groups are split again using the same process.

## Formula

For each candidate feature and threshold:

$$
\text{Weighted Gini} = \frac{n_{\text{left}}}{n} \cdot \text{Gini}(\text{left}) + \frac{n_{\text{right}}}{n} \cdot \text{Gini}(\text{right})
$$

The best split minimizes this score:

$$
\text{Best split} = \arg\min_{\text{feature},\, t} \;\text{Weighted Gini}
$$

If two splits tie, libraries use a consistent tie-breaking rule (often preferring the earlier feature).

## Worked example

On the 8-sample practice dataset, the root node compares every candidate:

| Feature | Threshold | Weighted Gini | Notes |
|---------|----------:|--------------:|-------|
| Feature 0 | 1.5 | 0.208 | |
| Feature 0 | 2.5 | 0.1875 | Best overall |
| Feature 0 | 3.5 | 0.375 | |
| Feature 1 | 0.5 | 0.4375 | |

**Winner:** Feature 0, threshold \(2.5\), weighted Gini \(= 0.1875\).

After this split:

- **Right** (\(x > 2.5\)): all class 1 → pure leaf, predict 1
- **Left** (\(x \leq 2.5\)): still mixed → recurse and find the next best split

## Common mistake

Comparing only one feature or one threshold. A tree must evaluate **all** features and **all** midpoints at each node—otherwise it can miss a much better split.

## Key takeaway

The best split is the (feature, threshold) pair with the lowest weighted Gini. Trees repeat this search at every impure node until stopping conditions apply.

Use the **Best Split Finder** below to see every candidate ranked on the practice dataset.
