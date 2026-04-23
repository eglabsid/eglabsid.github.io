---
layout: post
read_time: true
show_date: true
title: Python으로 처음부터 만들어본 머신러닝 라이브러리
date: 2021-02-28 12:32:20 -0600
description: 단일 퍼셉트론에서 출발해 XOR 문제를 해결하는 작은 신경망 라이브러리를 직접 구현한 기록입니다.
img: posts/20210228/MLLibrary.jpg
tags: [머신러닝, 코딩, 신경망, 파이썬]
author: Armando Maynez
github: amaynez/GenericNeuralNetwork/
---
요즘은 훌륭한 머신러닝 라이브러리와 툴킷이 넘쳐납니다. 오픈소스도 많고 문서도 잘 되어 있어서 바로 가져다 쓸 수 있죠.
그런데 저는 오히려 **처음부터 제 손으로 직접 작은 ML 라이브러리를 만들어보기로 했습니다.**

<center><img src="./assets/img/posts/20210228/ML_cloud.jpg" width="480px"></center>

이유는 단순합니다. 머신러닝을 제대로 이해하려면 개념만 읽는 것보다, 가장 작은 단위부터 직접 구현해보는 편이 훨씬 깊게 남는다고 생각했기 때문입니다.
기본적인 신경망 라이브러리를 스스로 작성해보면, ML 알고리즘을 떠받치는 수학과 데이터 흐름을 몸으로 익힐 수 있습니다.

또 하나의 장점은, 당시 제가 Python을 함께 배우고 있었기 때문에 이 프로젝트 자체가 아주 좋은 연습이 되었다는 점입니다.

엄밀히 말하면 이것을 거창하게 “Machine Learning Library”라고 부르기엔 조금 과장일 수 있습니다.
제가 처음 만들고자 했던 것은 **다층 구조를 가진 간단한 [퍼셉트론](./single-neuron-perceptron.html)** 이었기 때문입니다.

<center><img src="./assets/img/posts/20210228/nnet_flow.gif"></center>

처음 구현한 기능은 다음 정도로 좁혀 두었습니다.

- 신경망 생성
  - 입력 수
  - 은닉층의 개수와 크기
  - 출력 수
  - 학습률
- forward propagation, 즉 입력이 주어졌을 때 출력 예측
- backpropagation과 gradient descent를 통한 학습

모델은 순차 구조만 허용했고, 레이어는 dense / fully connected 레이어만 구현했습니다.
즉 한 레이어의 모든 뉴런이 다음 레이어의 모든 뉴런과 연결됩니다.
활성화 함수도 우선은 sigmoid만 사용했습니다.

<center><img src="./assets/img/posts/20210228/nn_diagram.png"></center>

이렇게 만든 신경망을 어디에 시험해볼까 고민하다가, 가장 유명한 장난감 문제 중 하나인 **XOR 문제**를 선택했습니다.

XOR은 단일 퍼셉트론만으로는 해결할 수 없는 연산입니다.
선형 결정 경계 하나로는 분리할 수 없기 때문입니다.

<center><img src="./assets/img/posts/20210228/xor_problem.png"></center>

AND나 OR는 2차원 평면 위에서 하나의 직선으로 참과 거짓을 나눌 수 있지만, XOR은 그렇지 않습니다.
그래서 이 문제를 풀려면 다층 퍼셉트론이 필요합니다.

실험을 위해 다음과 같은 네트워크를 만들었습니다.

```python
import Neural_Network as nn

inputs = 3
hidden_layers = [2, 1]
outputs = 1
learning_rate = 0.03

NN = nn.NeuralNetwork(inputs, hidden_layers, outputs, learning_rate)
```

입력값은 세 개를 사용했습니다.

1. 점의 x 좌표
2. 점의 y 좌표
3. x와 y의 곱

세 번째 입력은 시행착오 끝에 넣은 값인데, 네트워크가 더 빠르게 수렴하는 데 도움이 됐습니다.

은닉층은 2개의 뉴런을 가진 층 하나로 시작했고, 출력은 1개입니다.
출력이 0에 가까우면 False, 1에 가까우면 True로 해석하도록 만들었습니다.

학습 데이터는 XOR 규칙을 이용해 직접 생성했습니다.

```python
training_data = []
for n in range(learning_rounds):
    x = rnd.random()
    y = rnd.random()
    training_data.append([x, y, x * y, 0 if (x < 0.5 and y < 0.5) or (x >= 0.5 and y >= 0.5) else 1])
```

학습 루프는 아주 단순합니다.

```python
for data in training_data:
    NN.train(data[:3].reshape(inputs), data[3:].reshape(outputs))
```

이 라이브러리는 일부러 batch size 1만 지원하도록 제한했습니다.
즉 한 번에 하나의 샘플만 보고 학습합니다.
그래서 `train()` 함수는 입력 배열과 출력 배열을 각각 따로 받습니다.

학습이 실제로 어떻게 진행되는지 보려고, 예측 결과를 두 가지 방식으로 시각화했습니다.

- 3D surface plot
- scatter plot

surface plot에서는 z축이 신경망의 예측값을 의미합니다.
Matplotlib에서 먼저 figure와 subplot을 준비합니다.

```python
fig = plt.figure()
fig.canvas.set_window_title('Learning XOR Algorithm')
fig.set_size_inches(11, 6)

axs1 = fig.add_subplot(1, 2, 1, projection='3d')
axs2 = fig.add_subplot(1, 2, 2)
```

그 다음 0과 1 사이에 고르게 분포한 x, y 값을 만들고, 각 지점에서 신경망이 계산한 z 값을 구합니다.

```python
x = np.linspace(0, 1, num_surface_points)
y = np.linspace(0, 1, num_surface_points)
x, y = np.meshgrid(x, y)

z = np.array(NN.forward_propagation([x, y, x * y])).reshape(num_surface_points, num_surface_points)
```

이 값은 surface plot으로 그릴 수 있습니다.

```python
axs1.plot_surface(x, y, z,
                  rstride=1,
                  cstride=1,
                  cmap='viridis',
                  vmin=0,
                  vmax=1,
                  antialiased=True)
```

결과는 이런 식으로 나타납니다.

<center><img src="./assets/img/posts/20210228/Surface_XOR.jpg"></center>

scatter plot에서는 예측값을 색으로 표현했습니다.

```python
z = z.reshape(num_surface_points ** 2)
scatter = axs2.scatter(x, y,
                       marker='o',
                       s=40,
                       c=z.astype(float),
                       cmap='viridis',
                       vmin=0,
                       vmax=1)
```

<center><img src="./assets/img/posts/20210228/Final_XOR_Plot.jpg"></center>

이렇게 직접 구현해보니, 신경망이 결국은 대단히 복잡한 마법이 아니라
**입력, 가중치, 활성화 함수, 그리고 오차를 줄이는 반복 과정**의 조합이라는 사실이 더 명확하게 보였습니다.

물론 이 라이브러리는 작은 실험용 구현에 가깝습니다.
하지만 직접 만들어본 덕분에 다음 단계인 최적화 기법, 학습 안정성, 레이어 설계 같은 주제를 훨씬 구체적으로 이해할 수 있었습니다.

정리하면 이 프로젝트의 핵심은 성능보다도 학습 과정 그 자체였습니다.
이미 잘 만들어진 라이브러리를 쓰는 것도 중요하지만, 한 번쯤은 손으로 직접 구현해보는 경험이 신경망을 이해하는 가장 빠른 길일 수 있습니다.
