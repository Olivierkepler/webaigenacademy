# Stopping Conditions

Without limits, a decision tree can keep splitting until every leaf is pure—or until each leaf holds a single sample. That leads to **overfitting**.

## Big idea

**Stopping conditions** tell the tree when to stop growing and make a leaf instead of splitting again. A node becomes a leaf when any of these is true:

- All samples share the same class (pure node: Gini \(= 0\) or entropy \(= 0\))
- A hyperparameter limit is reached
- No split improves impurity enough

After the root split, the tree **recurses** only on child groups that are still impure and have not hit a stopping rule.

## Formula

A split is worth keeping when impurity drops:

$$
\text{Impurity(parent)} > \text{Weighted impurity(children)}
$$

If no candidate split lowers weighted impurity (or the improvement is below a threshold), the node becomes a leaf.

Common scikit-learn controls:

| Parameter | What it does |
|-----------|--------------|
| `max_depth` | Maximum number of split levels from the root |
| `min_samples_split` | Minimum samples required to split a node |
| `min_samples_leaf` | Minimum samples each leaf must hold |
| `min_impurity_decrease` | Minimum impurity reduction a split must achieve |

## Worked example

On our practice tree, Feature 0 \(\leq 2.5\) creates a right child that is pure (all class 1)—that branch **stops** immediately.

The left child is still mixed, so the tree recurses. Eventually Feature 1 at \(t = 0.5\) splits the last impure group into two pure leaves.

If we set `max_depth=1`, the tree would stop after the root split—even though the left child is still mixed. Tuning these knobs balances **underfitting** (too shallow) and **overfitting** (too deep).

## Common mistake

Setting `max_depth=None` with no other limits on a small dataset. The tree may memorize every training sample, including noise, and fail on new data.

## Key takeaway

Stopping conditions prevent trees from growing forever. Use `max_depth`, `min_samples_split`, `min_samples_leaf`, and `min_impurity_decrease` to control model complexity.

Experiment with these parameters in the practice notebook below.
