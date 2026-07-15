---
title: "Decision Trees Explained"
description: "Understand decision trees from the ground up—how they split data, measure impurity, avoid overfitting, and become a foundation for random forests."
publishedAt: "2026-07-01"
updatedAt: "2026-07-08"
author: "WebAIGen Academy"
category: "Machine Learning"
tags:
  - decision-trees
  - machine-learning
  - supervised-learning
  - explainability
coverImage: "/images/blog/decision-tree-explained.jpg"
featured: false
draft: false
---

A decision tree is a supervised learning model that asks a sequence of yes/no questions about your data and ends in a prediction. If you have ever followed a flowchart—“Is the patient older than 50? Is blood pressure high?”—you already understand the shape of a tree.

This post explains how trees split data, how they score splits, and how to keep them from memorizing noise.

## The big idea

At every step, a tree chooses a **feature** and a **threshold** that divides examples into two groups (for binary splits):

- **Left child:** feature value ≤ threshold
- **Right child:** feature value > threshold

It repeats this process on impure groups until a stopping rule says “stop and predict.”

```text
Root: Age <= 51.5?
├── Left  → mostly class 0 → predict 0
└── Right → Age was high
            └── BP <= 140?
                ├── Left  → predict …
                └── Right → predict …
```

## A tiny worked example

Imagine eight patients and one feature, `age`, with a disease label `0`/`1`.

| age | disease |
| --- | --- |
| 42 | 0 |
| 45 | 0 |
| 48 | 0 |
| 50 | 0 |
| 53 | 1 |
| 55 | 1 |
| 58 | 1 |
| 60 | 1 |

A threshold at `51.5` creates two pure groups:

- ages ≤ 51.5 → all `0`
- ages > 51.5 → all `1`

That split is almost “too perfect”—which is useful for learning, even if real medical data is messier.

## How the tree picks a split

The algorithm does not guess. It evaluates many candidate thresholds (often midpoints between sorted unique values) and scores each one.

For classification trees, a common score is **Gini impurity**.

### Gini impurity (one group)

For class proportions $p_i$:

$$
Gini = 1 - \sum_i p_i^2
$$

- Pure group (all one class): Gini = 0  
- Mixed 50/50 group: Gini = 0.5  

### Weighted Gini (a whole split)

A split creates left and right groups of different sizes. Weighted Gini averages their impurities by sample count:

$$
WeightedGini = \frac{n_L}{n} G_L + \frac{n_R}{n} G_R
$$

The tree prefers the candidate with the **lowest** weighted Gini—the split that most cleans the children.

## From root to full tree (recursion)

Finding the root is only step one.

1. Split the root
2. If a child is pure (or hits a stopping rule), make it a **leaf** with a prediction
3. If a child is still mixed, repeat the same search on that child

This reuse of the same recipe is why people say trees grow by **recursion**.

```python
from sklearn.tree import DecisionTreeClassifier

X = [[42], [45], [48], [50], [53], [55], [58], [60]]
y = [0, 0, 0, 0, 1, 1, 1, 1]

model = DecisionTreeClassifier(max_depth=1, random_state=42)
model.fit(X, y)
print(model.predict([[51], [52]]))
```

With `max_depth=1`, the model is allowed only one question—perfect for studying the root split in isolation.

## Classification trees vs regression trees

### Classification

Leaves predict a **class** (often the majority label in that leaf).

### Regression

Leaves predict a **number** (often the mean target value in that leaf).

The flowchart idea is the same; only the impurity measure and leaf prediction change. Regression trees commonly reduce squared error instead of Gini.

## Stopping conditions (how trees avoid chaos)

Without limits, a tree can keep splitting until every leaf holds a single training row. That can memorize noise.

Common controls:

| Parameter | Effect |
| --- | --- |
| `max_depth` | Caps how many questions deep the tree can go |
| `min_samples_split` | Needs enough samples before allowing another split |
| `min_samples_leaf` | Forces leaves to contain at least N samples |
| Pure node | No reason to split if every label already matches |

These knobs are your first defense against **overfitting**.

## How to read a trained tree

When you inspect a tree, ask:

1. Which feature appears near the root? (Often the strongest simple signal.)
2. Are early splits producing much purer children?
3. Do deep splits look fragile (tiny sample counts)?
4. Does the story match domain sense—or does it feel like noise hunting?

Explainability is a major reason trees remain popular in education and many tabular workflows.

## Strengths and weaknesses

### Strengths

- Easy to visualize and explain
- Handles non-linear relationships by stacking splits
- Requires relatively little feature scaling
- Great teaching model for impurity and recursion

### Weaknesses

- Single trees can be unstable (small data changes → different splits)
- Deep trees overfit easily
- Axes-aligned splits can struggle with diagonal patterns

**Random forests** address instability by combining many trees. First master one tree—then bagging will make more sense.

## A practical study checklist

1. Draw a tree by hand for a 6–10 row dataset
2. Compute Gini for a mixed node and a pure node
3. Compare two thresholds with weighted Gini
4. Train `DecisionTreeClassifier(max_depth=2)` on a tiny table
5. Change `max_depth` and watch depth/leaves change
6. Explain one leaf prediction to a friend in plain language

If you can do those six steps, you understand decision trees—not just the API call.

## Try it in WebAIGen Academy

Our Machine Learning path walks this exact ladder:

- Impurity measures (Gini, entropy, classification error)
- Threshold splits and weighted scores
- Building the root and recursing to leaves
- Stopping conditions and regression trees

Open the interactive lesson: [Decision Trees](/learn/machine-learning/decision-trees), then use the Practice Lab to fit a scikit-learn tree in your browser.

Decision trees turn data into questions you can audit. Learn the questions well, and later ensemble methods stop feeling mysterious.

**Keep learning:** Explore the full [Machine Learning course on WebAIGen Academy](/learn/machine-learning) and run the Decision Trees Practice Lab today.
