# Threshold Splits

## Big Idea

Before a decision tree can decide **which split is best**, it first needs to decide **where it is allowed to split**.

For numeric features, a decision tree **does not test every possible number**. Instead, it creates a small set of **candidate thresholds** from the data itself.

These candidate thresholds become the only locations where the tree will consider making a split.

## Real World Example

A hospital wants to build a machine learning model that predicts whether a patient has heart disease. Each row represents one patient. The features are **Age** and **Resting Blood Pressure**, while the target indicates whether heart disease was diagnosed.

Before we look at the numbers, here is the vocabulary we will use throughout this lesson:

- **Sample** — one row in the dataset (one patient)
- **Feature** — an input column the model uses to make a prediction (Age or Resting BP)
- **Target** — the output label we want to predict (Heart Disease: 0 = no, 1 = yes)

We have collected the following data for twelve patients.

| Patient | Age | Resting BP | Heart Disease |
|---------|----:|-----------:|:-------------:|
| P1 | 42 | 118 | 0 |
| P2 | 45 | 122 | 0 |
| P3 | 45 | 128 | 0 |
| P4 | 48 | 130 | 0 |
| P5 | 50 | 135 | 0 |
| P6 | 53 | 138 | 1 |
| P7 | 55 | 142 | 1 |
| P8 | 55 | 145 | 1 |
| P9 | 58 | 148 | 1 |
| P10 | 60 | 150 | 1 |
| P11 | 63 | 155 | 1 |
| P12 | 67 | 160 | 1 |

The interactive visualization on the right plots these patients.

- **Blue** = No Heart Disease
- **Red** = Heart Disease

Notice that older patients tend to appear in the upper-right portion of the graph.

## Computing Candidate Thresholds

Suppose the decision tree wants to split on **Age**. It begins with every Age value in the dataset, sorted from smallest to largest.

**Original Age values**

42, 45, 45, 48, 50, 53, 55, 55, 58, 60, 63, 67

↓

**Remove duplicate values**

42, 45, 48, 50, 53, 55, 58, 60, 63, 67

Why remove duplicates? A threshold is meant to separate one group of patients from another. If two patients share the same Age, no cut point between *identical* values can move one patient to the left and the other to the right. Duplicates are collapsed so the tree only considers boundaries where a split could actually change the grouping.

Next, a candidate threshold is placed halfway between each pair of consecutive unique values.

The midpoint formula is

$$
t_i=\frac{v_i+v_{i+1}}{2}
$$

where

- \(v_i\) is one sorted unique value
- \(v_{i+1}\) is the next unique value

Applying this formula to our sorted unique ages gives nine candidate thresholds:

$$
\begin{aligned}
t_1 &= \frac{42+45}{2}=43.5\\
t_2 &= \frac{45+48}{2}=46.5\\
t_3 &= \frac{48+50}{2}=49\\
t_4 &= \frac{50+53}{2}=51.5\\
t_5 &= \frac{53+55}{2}=54\\
t_6 &= \frac{55+58}{2}=56.5\\
t_7 &= \frac{58+60}{2}=59\\
t_8 &= \frac{60+63}{2}=61.5\\
t_9 &= \frac{63+67}{2}=65
\end{aligned}
$$

These are the only candidate thresholds that the decision tree will evaluate.

<details>
<summary><strong>Why Midpoints?</strong></summary>

You might wonder:

> Why not split at Age = 45?

The issue is not the number 45 itself — it is that **any** threshold strictly between 45 and 48 divides the patients in exactly the same way. Consider these four possibilities:

- 45.2
- 46
- 46.5
- 47.9

For each one, every patient with Age ≤ threshold lands in the left group, and every patient with Age > threshold lands in the right group. The partition is identical.

Testing infinitely many values between 45 and 48 would be wasteful. The decision tree therefore picks a single representative: the **midpoint**. This keeps the search small while preserving every distinct way the data can be divided.

</details>

<details>
<summary><strong>Threshold Visualization</strong></summary>

Use the interactive visualization to see how a threshold partitions the dataset. Select different candidate values and observe the following:

- **Blue points** — patients with no heart disease
- **Red points** — patients with heart disease
- **Dashed vertical line** — the active Age threshold
- **Left child** — all patients with Age ≤ threshold (left of the line)
- **Right child** — all patients with Age > threshold (right of the line)

As you move the threshold, watch how patients slide between the left and right groups. Older patients with higher resting blood pressure tend to cluster on the right side of the plot — but at this stage we are **only** learning how the data is divided. We are not yet judging whether a split is good or bad.

</details>

<details>
<summary><strong>Common Mistake</strong></summary>

A common misconception is that the threshold must equal one of the feature values.

This is not true.

Thresholds are usually **between** two observed values, not directly on top of one.

</details>

<details open>
<summary><strong>Key Takeaway</strong></summary>

Threshold splits answer one question:

> **Where can a decision tree split?**

They do **not** tell us which threshold is best.

Now that we know every location where a decision tree is allowed to split the data, the next question is: **Which threshold is the best one?** In the next lesson, we'll use **Gini Impurity** to score every candidate threshold and choose the best split.

</details>
