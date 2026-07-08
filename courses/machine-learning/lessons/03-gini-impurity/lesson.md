# Gini Impurity

## Big Idea

In the previous lesson, we learned where a decision tree is allowed to split the data. After a threshold divides patients into groups, the tree needs a way to measure **how mixed each group is**.

**Gini Impurity** answers that question for a **single group**.

- A **pure** group contains only one class (all patients have the same heart disease label).
- A **mixed** group contains more than one class (some patients have heart disease, some do not).

Gini Impurity does **not** score an entire split yet. It does **not** combine left and right groups. It only measures the impurity of **one group at a time**.

## Medical Example

Suppose a threshold on Age creates this **left group** from our heart disease dataset:

| Patient | Age | Heart Disease |
|---------|----:|:-------------:|
| P1 | 42 | 0 |
| P2 | 45 | 0 |
| P3 | 45 | 0 |
| P4 | 48 | 0 |
| P5 | 50 | 0 |

This group contains:

- 5 patients
- 5 with no heart disease (class 0)
- 0 with heart disease (class 1)

Every patient has the same label. This is a **pure group**.

## Formula

For \(K\) classes, Gini Impurity is:

$$
Gini = 1 - \sum_{k=1}^{K} p_k^2
$$

For binary classification (heart disease: 0 or 1):

$$
Gini = 1 - (p_0^2 + p_1^2)
$$

where

- \(p_0\) is the proportion of class 0 (no heart disease)
- \(p_1\) is the proportion of class 1 (heart disease)

## Worked Example 1: Pure Group

For the left group above:

$$
p_0 = \frac{5}{5}=1
$$

$$
p_1 = \frac{0}{5}=0
$$

Then:

$$
Gini = 1 - (1^2 + 0^2)=0
$$

A Gini score of **0** means the group is perfectly pure. If you predicted the majority class for every patient in this group, you would always be correct.

## Worked Example 2: Mixed Group

Now consider a different group:

| Patient | Age | Heart Disease |
|---------|----:|:-------------:|
| P4 | 48 | 0 |
| P5 | 50 | 0 |
| P6 | 53 | 1 |
| P7 | 55 | 1 |

This group contains:

- 4 patients
- 2 with no heart disease
- 2 with heart disease

Compute the proportions:

$$
p_0 = \frac{2}{4}=0.5
$$

$$
p_1 = \frac{2}{4}=0.5
$$

Then:

$$
Gini = 1 - (0.5^2 + 0.5^2)=0.5
$$

For binary classification, **0.5** is the highest possible Gini value. A 50/50 split is as mixed as a group can be.

## Intuition

Think of Gini as a mixing score for one group:

- **Gini = 0** — perfectly pure (one class only)
- **Gini close to 0** — mostly one class, with a few exceptions
- **Gini close to 0.5** — highly mixed (nearly half and half)

Lower Gini means a cleaner, more predictable group.

<details>
<summary><strong>Common Mistake</strong></summary>

A common mistake is computing Gini using the **whole dataset** instead of only the **group being evaluated**.

Gini Impurity is always calculated for **one group at a time** — for example, only the left group, or only the right group. Each group gets its own Gini score.

</details>

<details>
<summary><strong>Key Takeaway</strong></summary>

Gini Impurity tells us **how mixed one group is**.

It does not yet tell us whether a split is good or bad. In the next lesson, **Weighted Gini**, we will combine the Gini scores of the left and right groups to score an entire split.

</details>
