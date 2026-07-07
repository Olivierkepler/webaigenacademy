# Decision Trees

Decision trees classify data by asking a series of simple yes-or-no questions. Each branch splits the data until the model reaches a prediction.

## Goal

Train a decision tree on the Iris dataset and explore how `max_depth` affects the model.

## How Decision Trees Work

A decision tree starts at the root and splits data based on feature values. For example, it might ask whether petal length is greater than 2.5 cm, then continue splitting until each leaf represents a class label.

## Why max_depth Matters

`max_depth` limits how many splits the tree can make. A shallow tree may underfit, while a very deep tree may memorize the training data. In the notebook below, try different values and compare accuracy.
