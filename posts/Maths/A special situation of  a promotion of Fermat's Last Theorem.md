---
title: 费马大定理的一般情况的特殊情况的一种充分条件
---
# 费马大定理的一般情况的特殊情况的一种充分性

标题好吓人，但确实是……

## 来源

本题疑似从一道北大强基签到题改编为了初中自招题。后我稍微做了推广。

> 求证：对于$a,q,n \in \mathbb{N^+}$，$\sum \limits_{i=1}^n a_i x_i^{p_i}=x_0^{p_0}$有无穷组解的充分条件是$\gcd(\mathop{\operatorname{lcm}} \limits_{i=1}^n p_i,p_0)=1$。

> 引理1：
>
>> 方程$(\mathop{\operatorname{lcm}} \limits_{i=1}^n p^i)x-p_0 y = p_0-1$有正整数解的充要条件是$\gcd(\mathop{\operatorname{lcm}}\limits_{i=1}^n p_i,p_0)=1$。
>>
>
> 显然，$\gcd(p_0,p_0-1)=1$，故此方程系数不可约。
>
> 因此由贝祖定理，此方程有整数解的充要条件是$\gcd(\mathop{\operatorname{lcm}} \limits_{i=1}^n p_i,p_0)=1$。
>
> 而易证将$x,y$同时加上$p_0,\mathop{\operatorname{lcm}} \limits_{i=1}^n p_i$，仍然成立。因此，显然，存在正整数解是存在整数解的充要条件。

我们将引理1变形，记$(\mathop{\operatorname{lcm}} \limits_{i=1}^n p^i)x = p_0 y+p_0-1=r$，显然$r \in \mathbb{N^+}$。且$r+1 | p_0$，$\forall i \in [1,n] \cap \mathbb{Z}$，$r | p_i$

则$\forall m \in \mathbb{N^+}$，均可构造$x_i={(\sum \limits_{i=1}^n a_i)}^{\frac{m \mathop{\operatorname{lcm}}\limits_{j=0}^n p_j + r}{p_i}}$，$x_0={(\sum \limits_{i=1}^n a_i)}^{\frac{m \mathop{\operatorname{lcm}}\limits_{j=0}^n p_j + r+1}{p_0}}$。最终等式两边均变为${(\sum \limits_{i=1}^n a_i)}^{m\mathop{\operatorname{lcm}}\limits_{j=0}^n p_j+ r+1}$。$\square$

## 再拓展

很显然，妄图证明必要性或者之类的纯纯做梦。因为$\sum \limits_{i=1}^n a_i x_i^{p_i}=x_0^{p_0}$是==费马大定理==的一般情况。。。显然不是高中生能触碰的。
