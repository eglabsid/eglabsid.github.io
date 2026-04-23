---
layout: post
read_time: true
show_date: true
title: 신경망 최적화 기법과 알고리즘 정리
date: 2021-03-12 13:32:20 -0600
description: backpropagation 과정에서 momentum을 포함한 주요 최적화 기법을 어떻게 적용했는지 정리한 글입니다.
img: posts/20210312/nnet_optimization.jpg
tags: [코딩, 머신러닝, 최적화, 딥러닝]
author: Armando Maynez
github: amaynez/TicTacToe/blob/7bf83b3d5c10adccbeb11bf244fe0af8d9d7b036/entities/Neural_Network.py#L199
mathjax: yes
toc: yes
---
제가 만들었던 [틱택토를 스스로 학습하는 신경망 프로젝트](./deep-q-learning-tic-tac-toe.html)를 구현하면서,
생각보다 빨리 부딪힌 문제가 하나 있었습니다.
바로 **backpropagation 과정에서 최소한 하나 이상의 momentum 기반 최적화 기법이 필요하다**는 점이었습니다.

틱택토 프로젝트 글 하나에 모든 내용을 다 넣기에는 너무 길어졌기 때문에,
최적화 기법만 따로 정리해 코드와 함께 남기기로 했습니다.

## Adam
[source](https://ruder.io/optimizing-gradient-descent/index.html#adam)

Adam(Adaptive Moment Estimation)은 가중치와 bias마다 적응적으로 learning rate를 조정하는 최적화 방법입니다.
과거 gradient의 지수이동평균 \(m_t\) 와, gradient 제곱값의 지수이동평균 \(v_t\) 를 함께 추적합니다.

<p style="text-align:center">\(
\begin{align}
\begin{split}
m_t &amp;= \beta_1 m_{t-1} + (1 - \beta_1) g_t \\
v_t &amp;= \beta_2 v_{t-1} + (1 - \beta_2) g_t^2
\end{split}
\end{align}
\)</p>

\(m_t\) 는 1차 모멘트(평균), \(v_t\) 는 2차 모멘트(비중심 분산)에 대한 추정치입니다.
초기에는 둘 다 0에서 시작하기 때문에 초반 단계에서 편향이 생길 수 있고,
이를 보정하기 위해 bias-corrected estimate를 씁니다.

<p style="text-align:center">\(
\begin{align}
\begin{split}
\hat{m}_t &amp;= \dfrac{m_t}{1 - \beta^t_1} \\
\hat{v}_t &amp;= \dfrac{v_t}{1 - \beta^t_2}
\end{split}
\end{align}
\)</p>

최종 업데이트 식은 다음과 같습니다.

<p style="text-align:center">\(\theta_{t+1} = \theta_{t} - \dfrac{\eta}{\sqrt{\hat{v}_t} + \epsilon} \hat{m}_t\)</p>

보통 \(\beta_1 = 0.9\), \(\beta_2 = 0.999\), \(\epsilon = 10^{-8}\) 을 기본값으로 많이 사용합니다.

[GitHub에서 보기](https://github.com/amaynez/TicTacToe/blob/b429e5637fe5f61e997f04c01422ad0342565640/entities/Neural_Network.py#L243)

```python
# decaying averages of past gradients
self.v["dW" + str(i)] = ((c.BETA1
                        * self.v["dW" + str(i)])
                        + ((1 - c.BETA1)
                        * np.array(self.gradients[i])
                        ))
self.v["db" + str(i)] = ((c.BETA1
                        * self.v["db" + str(i)])
                        + ((1 - c.BETA1)
                        * np.array(self.bias_gradients[i])
                        ))

# decaying averages of past squared gradients
self.s["dW" + str(i)] = ((c.BETA2
                        * self.s["dW"+str(i)])
                        + ((1 - c.BETA2)
                        * (np.square(np.array(self.gradients[i])))
                         ))
self.s["db" + str(i)] = ((c.BETA2
                        * self.s["db" + str(i)])
                        + ((1 - c.BETA2)
                        * (np.square(np.array(
                                         self.bias_gradients[i])))
                         ))

if c.ADAM_BIAS_Correction:
    # bias-corrected first and second moment estimates
    self.v["dW" + str(i)] = self.v["dW" + str(i)]
                          / (1 - (c.BETA1 ** true_epoch))
    self.v["db" + str(i)] = self.v["db" + str(i)]
                          / (1 - (c.BETA1 ** true_epoch))
    self.s["dW" + str(i)] = self.s["dW" + str(i)]
                          / (1 - (c.BETA2 ** true_epoch))
    self.s["db" + str(i)] = self.s["db" + str(i)]
                          / (1 - (c.BETA2 ** true_epoch))

# apply to weights and biases
weight_col -= ((eta * (self.v["dW" + str(i)]
                      / (np.sqrt(self.s["dW" + str(i)])
                      + c.EPSILON))))
self.bias[i] -= ((eta * (self.v["db" + str(i)]
                        / (np.sqrt(self.s["db" + str(i)])
                        + c.EPSILON))))
```

## SGD Momentum
[source](https://ruder.io/optimizing-gradient-descent/index.html#momentum)

기본적인 SGD는 골짜기 모양의 손실 지형에서 진동하기 쉽습니다.
Momentum은 이전 스텝의 방향을 일부 유지해 이 진동을 줄이고, 더 빠르게 수렴하게 도와줍니다.

<p style="text-align:center">\(
\begin{align}
\begin{split}
v_t &amp;= \beta_1 v_{t-1} + \eta \nabla_\theta J(\theta) \\
\theta &amp;= \theta - v_t
\end{split}
\end{align}
\)</p>

직관적으로는 공을 내리막길에 굴리는 것과 비슷합니다.
같은 방향의 gradient가 계속 나오면 더 빠르게 가속되고,
방향이 흔들리면 그 흔들림을 줄여줍니다.

[GitHub에서 보기](https://github.com/amaynez/TicTacToe/blob/b429e5637fe5f61e997f04c01422ad0342565640/entities/Neural_Network.py#L210)

```python
self.v["dW"+str(i)] = ((c.BETA1*self.v["dW" + str(i)])
                       +(eta*np.array(self.gradients[i])
                       ))
self.v["db"+str(i)] = ((c.BETA1*self.v["db" + str(i)])
                       +(eta*np.array(self.bias_gradients[i])
                       ))

weight_col -= self.v["dW" + str(i)]
self.bias[i] -= self.v["db" + str(i)]
```

## Nesterov accelerated gradient (NAG)
[source](https://ruder.io/optimizing-gradient-descent/index.html#nesterovacceleratedgradient)

Momentum이 현재 gradient와 이전 속도를 이용해 움직인다면,
NAG는 “한 발 앞서” 가중치가 어디로 갈지 먼저 예측하고 gradient를 측정합니다.

<p style="text-align:center">\(
\begin{align}
\begin{split}
v_t &amp;= \beta_1 v_{t-1} + \eta \nabla_\theta J(\theta - \beta_1 v_{t-1}) \\
\theta &amp;= \theta - v_t
\end{split}
\end{align}
\)</p>

이 방식은 과하게 가속된 상태에서 overshoot 하는 문제를 줄여줍니다.
즉, momentum보다 더 민감하고 반응성이 좋은 업데이트를 기대할 수 있습니다.

[GitHub에서 보기](https://github.com/amaynez/TicTacToe/blob/b429e5637fe5f61e997f04c01422ad0342565640/entities/Neural_Network.py#L219)

```python
v_prev = {"dW" + str(i): self.v["dW" + str(i)],
          "db" + str(i): self.v["db" + str(i)]}

self.v["dW" + str(i)] =
            (c.NAG_COEFF * self.v["dW" + str(i)]
           - eta * np.array(self.gradients[i]))
self.v["db" + str(i)] =
            (c.NAG_COEFF * self.v["db" + str(i)]
           - eta * np.array(self.bias_gradients[i]))

weight_col += ((-1 * c.BETA1 * v_prev["dW" + str(i)])
               + (1 + c.BETA1) * self.v["dW" + str(i)])
self.bias[i] += ((-1 * c.BETA1 * v_prev["db" + str(i)])
               + (1 + c.BETA1) * self.v["db" + str(i)])
```

## RMSprop
[source](https://ruder.io/optimizing-gradient-descent/index.html#rmsprop)

RMSprop은 Geoff Hinton이 제안한 adaptive learning rate 계열의 기법입니다.
핵심 아이디어는 각 파라미터의 gradient 제곱 평균으로 learning rate를 나누어,
너무 빠르게 혹은 너무 느리게 학습되는 현상을 완화하는 것입니다.

<p style="text-align:center">\(
\begin{align}
\begin{split}
E[\theta^2]_t &amp;= \beta_1 E[\theta^2]_{t-1} + (1-\beta_1) \theta^2_t \\
\theta_{t+1} &amp;= \theta_t - \dfrac{\eta}{\sqrt{E[\theta^2]_t + \epsilon}} \theta_t
\end{split}
\end{align}
\)</p>

보통 \(\beta_1 = 0.9\), learning rate \(\eta = 0.001\) 정도를 많이 사용합니다.

[GitHub에서 보기](https://github.com/amaynez/TicTacToe/blob/b429e5637fe5f61e997f04c01422ad0342565640/entities/Neural_Network.py#L232)

```python
self.s["dW" + str(i)] = ((c.BETA1
                      * self.s["dW" + str(i)])
                      + ((1-c.BETA1)
                      * (np.square(np.array(self.gradients[i])))
                        ))
self.s["db" + str(i)] = ((c.BETA1
                      * self.s["db" + str(i)])
                      + ((1-c.BETA1)
                      * (np.square(np.array(self.bias_gradients[i])))
                        ))

weight_col -= (eta * (np.array(self.gradients[i])
              / (np.sqrt(self.s["dW"+str(i)]+c.EPSILON)))
              )
self.bias[i] -= (eta * (np.array(self.bias_gradients[i])
               / (np.sqrt(self.s["db"+str(i)]+c.EPSILON)))
                )
```

## 정리

작은 프로젝트를 구현할 때도 최적화 기법은 성능이 아니라 **학습의 안정성** 때문에 중요합니다.
특히 제가 만든 간단한 신경망처럼 직접 gradient를 다루는 구현에서는,
Momentum, RMSprop, Adam 같은 알고리즘이 수렴 속도와 진동 억제에 큰 차이를 만듭니다.

결국 중요한 건 “어떤 알고리즘이 무조건 최고인가”보다,
내가 풀고 있는 문제의 손실 지형과 학습 방식에 맞는 업데이트 규칙을 선택하는 것입니다.

전체 코드가 궁금하다면 아래 구현을 참고하면 됩니다.

[전체 코드 보기](https://github.com/amaynez/TicTacToe/blob/b429e5637fe5f61e997f04c01422ad0342565640/entities/Neural_Network.py#L1)
