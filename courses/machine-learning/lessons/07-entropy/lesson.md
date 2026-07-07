# Entropy

Gini is not the only way to measure mixing. **Entropy** comes from information theory and captures how uncertain we are about a node's class label.

## Big idea

High entropy means high uncertainty—many classes are represented. Low entropy means we are fairly sure which class dominates.

A **pure node** has entropy \(= 0\). Like Gini, entropy helps decision trees find splits that create cleaner child groups. Scikit-learn lets you switch criteria with `criterion="entropy"`.

## Formula

For class proportions \(p_0, p_1, \ldots\):

$$
H = -\sum_{i} p_i \log_2(p_i)
$$

For two classes, entropy ranges from \(0\) (pure) to \(1\) (50/50).

**Information gain** measures how much a split reduces uncertainty:

$$
\text{IG} = H(\text{parent}) - \text{Weighted } H(\text{children})
$$

A good split has high information gain—meaning child nodes are more certain than the parent.

## Worked example

Parent node: 4 class 0 and 4 class 1 (50/50).

$$
H_{\text{parent}} = -\left(\tfrac{1}{2}\log_2\tfrac{1}{2} + \tfrac{1}{2}\log_2\tfrac{1}{2}\right) = 1.0
$$

After splitting Feature 0 at \(t = 2.5\):

- Left (3 class 0, 1 class 1): \(H_{\text{left}} \approx 0.811\)
- Right (4 class 1): \(H_{\text{right}} = 0\)

$$
\text{Weighted } H = \tfrac{4}{8}(0.811) + \tfrac{4}{8}(0) = 0.406
$$

$$
\text{IG} = 1.0 - 0.406 = 0.594
$$

## Common mistake

Treating entropy and Gini as different goals. Both reward purer children—they just use different math. In practice, trees trained with either criterion often perform similarly.

## Key takeaway

Entropy measures uncertainty; information gain measures how much a split reduces it. Lower child entropy (higher information gain) means a better split.

Try computing entropy for a small class distribution in the practice notebook below.
