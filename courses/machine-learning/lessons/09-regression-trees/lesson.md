# Regression Trees

Decision trees are not limited to yes/no class labels. **Regression trees** predict continuous numbers—prices, temperatures, scores.

## Big idea

In classification, each leaf predicts a class. In regression, each leaf predicts a **number**—usually the **mean** of the target values that landed in that leaf.

Split quality is measured by how much variance remains in the target. Trees prefer splits that make each child group's targets more similar—lower spread, lower error.

## Formula

**Leaf prediction** (mean of targets in the leaf):

$$
\hat{y}_{\text{leaf}} = \frac{1}{n}\sum_{i=1}^{n} y_i
$$

**Mean squared error (MSE)** as impurity:

$$
\text{MSE} = \frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y})^2
$$

A split is good when the weighted MSE of its children is lower than the parent's MSE—similar in spirit to weighted Gini, but for continuous targets.

Some implementations also support **MAE** (mean absolute error), which is more robust to outliers.

## Worked example

A leaf contains targets \(y = \{10, 12, 14\}\):

$$
\hat{y} = \frac{10 + 12 + 14}{3} = 12
$$

$$
\text{MSE} = \frac{(10-12)^2 + (12-12)^2 + (14-12)^2}{3} = \frac{4 + 0 + 4}{3} \approx 2.67
$$

After a split, the tree compares weighted MSE on the left and right—just as it compares weighted Gini for classification.

## Common mistake

Using classification impurity (Gini or entropy) on a regression problem. Continuous targets need variance-based measures like MSE, and leaves predict means—not class labels.

## Key takeaway

Regression trees split to reduce target variance. Each leaf predicts the mean target value in that region.

Explore a simple regression tree workflow in the practice notebook below.
