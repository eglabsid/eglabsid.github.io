---
layout: post
read_time: true
show_date: true
title: 신경망이란 무엇인가?
date: 2021-04-02
img: posts/20210402/post7-header.webp
tags: [신경망, 머신러닝, 인공지능]
category: theory
author: Armando Maynez
description: "ELI5 스타일로 신경망의 기본 개념을 풀어쓴 글입니다."
---
요즘은 AI 관련 뉴스를 보기 어렵지 않습니다.
조금만 둘러봐도 의료, 공급망, 제조, 국방, 콘텐츠 생성까지 거의 모든 분야에서 AI 이야기가 등장합니다.

- [Google 내부 갈등과 함께 큰 논쟁을 불러온 강력한 AI 기법](https://www.morningbrew.com/emerging-tech/stories/2021/03/29/one-biggest-advancements-ai-also-sparked-fierce-debate-heres?utm_source=morning_brew)
- [COVID 시기에도 피해를 줄인 AI 기반 기업들](https://fortune.com/2021/04/02/ai-forecasting-supply-chain-factories-caterpillar-agco/)
- [혈관의 위험 신호를 감지하는 AI 기술](https://www.mobihealthnews.com/news/emea/ai-technology-detects-ticking-time-bomb-arteries)
- [신약 개발에서 현실 성과를 내기 시작한 AI](https://www.genengnews.com/insights/ai-in-drug-discovery-starts-to-live-up-to-the-hype/)
- [AI 활용을 위해 데이터를 정비하려는 미 국방부](https://www.c4isrnet.com/artificial-intelligence/2021/04/02/pentagon-seeks-commercial-solutions-to-get-its-data-ready-for-ai/)

그만큼 artificial intelligence, 특히 machine learning과 deep neural network는 이제 일상 속으로 깊이 들어왔습니다.
그런데 막상 “AI가 뭐냐”라고 물으면, 많은 사람은 “똑똑해지는 알고리즘” 정도로만 이해하고 있는 경우가 많습니다.

그래서 이번 글에서는 **ELI5(Explain Like I'm 5)** 스타일로, “신경망이란 무엇인가?”를 최대한 쉽게 설명해보려 합니다.

## 아주 짧은 역사

인간은 오래전부터 “지능을 가진 기계”를 상상해왔습니다.
어떤 사람들은 artificial intelligence의 뿌리를 고대 그리스까지 거슬러 올라가기도 하고,
실제로 역사적으로도 “생각하는 기계”를 만들려는 시도는 반복되어 왔습니다.

대표적인 사례로 1837년 Charles Babbage의 **Analytical Engine**을 들 수 있습니다.

![The Analytical Engine](./assets/img/posts/20210402/post7-analytical-engine.jpg)
<small>Charles Babbage의 Analytical Engine - 1837</small>

그리고 20세기 중반, 인간의 뇌가 정보를 처리하는 방식을 모델링하려는 시도 속에서 **Neural Network**가 등장합니다.
Cornell의 Frank Rosenblatt는 집파리의 시각 시스템을 연구하며 [퍼셉트론](./single-neuron-perceptron.html)이라는 개념을 제안했습니다.
퍼셉트론은 입력을 받아 간단한 수학 연산을 수행하고 하나의 출력을 내놓는 아주 단순한 모델입니다.

![A perceptron](./assets/img/posts/20210125/Perceptron.png)

## 퍼셉트론을 집파리로 비유해보기

예를 들어 집파리의 눈과 뇌를 상상해봅시다.

- 눈의 여러 셀이 어떤 자극을 감지하면 1
- 아무것도 감지하지 못하면 0

이 입력값들을 퍼셉트론이 받아 최종적으로 0 또는 1을 출력한다고 생각할 수 있습니다.

- 1이면 “도망쳐라”
- 0이면 “괜찮다”

![A housefly eye](./assets/img/posts/20210402/post7-housefly-eye.jpg)

여러 눈세포가 동시에 1을 낸다면, 무언가가 가까이 있다는 뜻이고,
퍼셉트론은 위험 신호라고 판단해 1을 출력할 수 있습니다.

![The fly vision](./assets/img/posts/20210402/post7-fly-vision.jpg)

이 관점에서 보면 퍼셉트론은 결국 **입력값과 가중치(weight)를 곱하고 합산하는 수학 연산**입니다.

## 학습은 어디서 일어날까?

진짜 중요한 포인트는 여기서 시작됩니다.
퍼셉트론의 가중치는 고정된 상수가 아니라,
정답이 알려진 사례들에 대해 오차를 줄이도록 **학습(Training)** 될 수 있습니다.

즉, 관측값과 정답이 있을 때 그 차이를 줄여가며 파라미터를 조정하는 과정이
우리가 흔히 말하는 **신경망 학습**입니다.

<tweet>이 아이디어는 지금도 AI라고 부르는 시스템의 핵심 구성 요소 중 하나입니다.</tweet>

## 신경망은 퍼셉트론의 조합이다

이제 퍼셉트론 하나만으로는 복잡한 문제를 풀기 어렵다는 점이 자연스럽게 보입니다.
그래서 여러 퍼셉트론을 층(layer) 형태로 연결한 것이 신경망입니다.

즉, 퍼셉트론은 더 이상 “파리의 뇌 전체”가 아니라,
신경망 안에서 동작하는 **하나의 뉴런**이 됩니다.

![A multilayer perceptron](./assets/img/posts/20210402/post7-multilayer-perceptron.png)

기본적인 신경망은 크게 세 부분으로 구성됩니다.

- Input
- Hidden Layers
- Output

![Neural network components](./assets/img/posts/20210228/nnet_flow.gif)

## Input

신경망의 입력은 본질적으로 숫자입니다.
텍스트의 문자, 이미지의 픽셀, 음성의 주파수, 센서 값 등도 결국 숫자로 바꿀 수 있다면 입력이 될 수 있습니다.

이 점 때문에 신경망의 응용 범위가 매우 넓습니다.

- 틱택토 판 상태라면 9개의 입력일 수도 있고
- 자율주행 이미지라면 수천 개 픽셀일 수도 있습니다

예를 들어 컬러 픽셀을 입력으로 쓴다면, 하나의 픽셀은 보통 R, G, B 세 개의 값으로 나뉘어 입력됩니다.

## Hidden Layers

레이어는 같은 종류의 연산을 수행하는 퍼셉트론 묶음입니다.
모든 뉴런이 같은 식을 사용하더라도, 각 뉴런은 서로 다른 가중치를 가지기 때문에 결과는 다를 수 있습니다.

가장 전형적인 형태는 dense layer입니다.
입력의 모든 값이 레이어 안의 모든 뉴런과 연결되고, 각 연결은 고유한 가중치를 가집니다.

![post7-dense-layers](./assets/img/posts/20210402/post7-dense-layers.png)

하나의 hidden layer 출력은 다음 hidden layer의 입력이 됩니다.
이 과정을 반복하면서 더 복잡한 패턴을 표현할 수 있게 됩니다.

신경망의 설계에서 중요한 것은 다음과 같습니다.

- 레이어 개수
- 각 레이어의 종류
- 각 레이어의 뉴런 수

이 전체 구조를 보통 **network topology**라고 부릅니다.

## Output

마지막에는 output layer가 있습니다.
여기서 계산된 값이 신경망 전체의 최종 출력입니다.

문제에 따라 출력 형태는 달라집니다.

- 하나의 값만 내서 어떤 행동의 확률을 표현할 수도 있고
- 동물 이미지를 분류한다면 동물 종마다 하나씩 출력을 둘 수도 있습니다

결국 신경망은 여러 뉴런이 층을 이루며 입력을 처리하고,
학습 후에는 이전에 보지 못한 데이터에 대해서도 꽤 정확한 결과를 내놓는 구조입니다.

## 왜 신경망이 강력할까?

많은 문제는 다른 알고리즘으로도 풀 수 있습니다.
하지만 신경망은 학습이 끝난 뒤에는 매우 단순한 수학 연산만으로 결과를 빠르게 낼 수 있다는 장점이 있습니다.

물론 여기서는 일부러 많은 것을 생략했습니다.

- bias
- activation function
- backpropagation의 수학
- gradient descent의 세부 동작

이런 내용은 더 깊은 글에서 다루는 편이 좋습니다.

## Alexa는 어떻게 이해할까?

실생활 예시로 Alexa를 생각해보면 이해가 조금 더 쉬워집니다.

![Alexa recognizing speach](./assets/img/posts/20210402/post7-alexa.png)

예를 들어 “Alexa, play Van Halen”이라고 말한다고 합시다.
이 과정에는 여러 신경망이 연쇄적으로 동작합니다.

### 1. Speech Recognition

입력은 우리의 음성입니다.
사람에게는 쉬워 보이지만, 기계가 음성을 이해하는 일은 매우 어렵습니다.
목소리 톤, 억양, 발음, 의도 같은 요소가 너무 많기 때문입니다.

첫 번째 단계에서는 신경망이 음성을 텍스트로 바꾸는 역할을 수행할 수 있습니다.

### 2. Natural Language Understanding

음성이 텍스트로 바뀌었다고 해서 끝이 아닙니다.
이제 기계는 “우리가 무엇을 의미했는지”를 이해해야 합니다.

![post7-alexa-natural-lang](./assets/img/posts/20210402/post7-alexa-natural-lang.png)

여기서 신경망은 다음을 추정합니다.

- 호출 대상: Alexa
- 의도: 음악 재생
- 대상: Van Halen

즉, 단순한 수학 연산의 조합으로 명령어의 구조와 의미를 해석하는 것입니다.

### 3. Response Generation

의미를 이해한 뒤 Alexa는 행동을 수행하고, 다시 음성으로 응답합니다.
예를 들어 “Playing songs by Van Halen on Spotify” 같은 식이죠.

이 과정에서도 speech synthesis가 사용되며,
피치, 길이, 강세 같은 요소가 함께 조절됩니다.

![post7-alexa-steps](./assets/img/posts/20210402/post7-alexa-steps.png)
<small>복잡해 보이지만, 결국 AI가 우리를 이해하는 과정도 수많은 단순 연산의 조합으로 볼 수 있습니다.</small>

## 마무리

Amazon Alexa 같은 시스템은 엄청난 양의 학습과 엔지니어링을 거쳤지만,
그 기반에는 여전히 **입력, 가중치, 층, 출력, 그리고 오차를 줄이는 학습**이라는 단순한 구조가 있습니다.

신경망을 처음 배울 때는 너무 거대한 기술처럼 느껴질 수 있습니다.
하지만 퍼셉트론에서부터 차근차근 올라가 보면,
결국 이 구조가 왜 오늘날 AI의 핵심 블록이 되었는지 자연스럽게 이해할 수 있습니다.
