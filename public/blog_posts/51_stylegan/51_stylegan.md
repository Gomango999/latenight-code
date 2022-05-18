---
title: "A Brief Intro to StyleGAN"
description: How they used style transfer techniques to improve a GAN
author: Kevin Zhu
public: true
uploadDate: 2022-05-17 02:16+11:00
<!-- coverArt: /blog_posts/51_stylegan/images/cover2.png -->
coverArt: /blog_posts/51_stylegan/images/Karras_A_Style-Based_Generator_Architecture_for_Generative_Adversarial_Networks_CVPR_2019_paper/image-000.jpg
---

- [The Paper](https://openaccess.thecvf.com/content_CVPR_2019/html/Karras_A_Style-Based_Generator_Architecture_for_Generative_Adversarial_Networks_CVPR_2019_paper.html){target="_blank"}
- [Demo Video](https://www.youtube.com/watch?v=kSLJriaOumA){target="_blank"}
- [CVPR 2019 Presentation](https://youtu.be/4IInDT_S0ow?t=4763){target="_blank"}

## What is StyleGAN?
StyleGAN is a new generator architecture for GANs made by NVIDIA, that generates pixel pictures of human faces of high quality. It borrows idea from style transfer literature, and applies it to generating faces from latent codes instead.  Rhe network is able to separate out details at every level, allowing independent control over global features such as pose, as well as finer details such as skin tecture and hair placement.

<center>
![_Examples of the countless diverse images that StyleGAN can generate_](/blog_posts/51_stylegan/images/Karras_A_Style-Based_Generator_Architecture_for_Generative_Adversarial_Networks_CVPR_2019_paper/image-000.jpg){width=400px}
</center>

The network embeds the input latent code into an intermediate latent space, which is then passed into each layer of a synthesis network. The synthesis network takes in a constant tensor as input, and with the help of the intermediate latent code and some extra injected noise at each layer, it is able to progressible learn and upscale an image until we reach a human face.

## Outline
In the rest of this article, we'll cover the following:

- [What makes it better than previous works?](#what-makes-it-better-than-previous-works)
- [How does it work?](#how-does-it-work)
- [Cool things the paper does](#cool-things-the-paper-does)

## What makes it better than previous works?
Previous networks focused alot on improving the discriminator, whereas on the generator side, they mainly worked with the distributions in input latent space to encourage certain results. StyleGAN takes a unique approach to all of this, giving it several big advantages:

1. The quality of images is high, both in resolution as well as [FID score](https://en.wikipedia.org/wiki/Fr%C3%A9chet_inception_distance).
2. The intermediate latent space is learnt in such a way that it admits a more linear representation of different face attributes.

<center>
![_The evolution of GAN generators over the years_](/blog_posts/51_stylegan/images/Screen Shot 2022-05-18 at 11.44.47 pm.png){width=600px}
</center>

_Note: I don't have enough experience with previous works to definitively say what is better about this than prior art._

## How does it work?
We start with a latent code $\bf{z} \in \mathcal{Z}$, which is then passed through an 8 layer MLP (defined as $f : \mathcal{Z} \to \mathcal{W}$) to obtain $\bf{w} \in \mathcal{W}$ in the intermediate latent space. This $\bf{w}$ is then passed into each of the layers of a synthesis network, with a different learned affine transformation in each layer. Each of these values are called "styles", which we can define as $\bf{y} = (y_s, y_b)$.

<center>
![_The network diagram. It contains 26.2M trainable parameters._](/blog_posts/51_stylegan/images/Screen Shot 2022-05-18 at 11.46.31 pm.png){width=400px}
</center>

Meanwhile, we synthesis network starts off with a latent code. At each layer, we upscale the current image, inject some Gaussian noise, and then use Adaptive Instance Normalisation (AdaIN) to merge the style and image together. The formula for AdaIN is given as follows:

$$\operatorname{AdaIN}(\bf{x}_i, \bf{y}) = \bf{y}_{s, i} \frac{\bf{x}_i - \mu(\bf{x}_i)}{\sigma(\bf{x}_i)} + \bf{y_{b, i}}.$$

This has the effect of normalising each feature in the map $\bf{x}_i$ separately, before scaling and biasing using the corresponding scalar component in style $\bf{y}$. This continues until the final image is generated.


## Cool things the paper does

#### _Mixing together different styles_

To encourage styles to localise to each layer, the authors use a technique called mixing regularisation during training. In this procedure, a percentage of images are chosen to be generated using two latent codes. It works by using one latent code up to a point, and then switching to another one. This regularisation technique helps to prevent the network from assuming adjacent styles are correlated, and thus separates out the effects of styles in each layer. 

Doing this also has the great side effect that we can start mixing styles together between two completely different people. For example, we copy the coarse style from one generated image to another, we can start to see that features such as gender, age, pose and hair can be copied from one person to another. 

<center>
![_Transposing styles from source A into source B, at different levels of detail._](/blog_posts/51_stylegan/images/Screen Shot 2022-05-18 at 11.22.38 pm.png){width=700px}
</center>

#### _Adding stochastic variation with noise_
Typically hair tends to exhibit stochastic properties, even though the exact placement of each strand don't matter. 

<center>
![_Example of how the exact placement of hair is essentially random and doesn't matter_](/blog_posts/51_stylegan/images/Screen Shot 2022-05-18 at 11.30.10 pm.png){width=450px}
</center>

In previous GANs, this would mean that the network would have to use up some of it's bandwidth in order to generate ways to place the hair.

> _"Given that the only input to the network is through the input layer, the network needs to invent a way to generate spatially-varying pseudorandom numbers from earlier activations whenever they are needed. This consumes network capacity and hiding the periodicity of generated signal is difficult — and not always successful"_

Hence, Gaussian noise is injected into the network at each layer in order to remove the need to generate these random numbers. Not only that, the injected noise only affects the local stochastic features, without affecting global properties such as pose or hair style. This is a known affect from previous literature

> _"... spatially invariant statistics (Gram matrix, channel-wise mean, variance, etc.) reliably encode the style of an image while spatially varying features encode a specific instance."_

If the network tries to control something like the pose using stochastic noise, then since the noise is by definition noisy, even close together pixels will get affected in dramatically different ways, causing a wildly incosistent poses across the iamge. This is easily picked up by the discriminiator, and thus is discouraged by the generator architecture.

Furthermore, since there is a fresh set of noise added at each layer, there is no incentive for stochastic features to use noise from previous layers. Hence, the effects of noise is effectively localised to the layer it is injected in.

#### _Disentangling the latent space_
Ideally, we would like the transformation from our latent space to the final image to be one where various final picture attributes form linear subspaces in our input latent space (e.g. one element in the input code determines the final age). This is known as disentanglement of features.

However, missing features in the training set can lead to a distorted latent space, as show in the paper. For example, consider two factors of variation (e.g. masculinity and hair length). Now assume the training data is missing one section (e.g. long haired males), as shown in (a).  

<center>
![_Visualisation of disentangling the latent space_](/blog_posts/51_stylegan/images/Screen Shot 2022-05-18 at 11.36.00 pm.png){width=450px}
</center>

Then after a mapping from $\mathcal{Z}$ is learned, the mapping is distorted (b) since there cannot be any gaps in the input. Therefore, the learned mapping from $\mathcal{Z}$ to $\mathcal{W}$ can be used to reverse the warping. 

> _"We posit that there is pressure for the generator to do so, as it should be easier to generate realistic images based on a disentangled representation than based on an entangled representation."_

The authors describe two novel methods to measure entagnlement

1. Perceptual Path Length 
    - A measure of how quickly an image changes as we interpolate from one point to another in $\mathcal{Z}$
2. Linear Separability 
    - Label 100,000 images using a separate trained classification network based on binary attributes (e.g. gender). Then, fit a linear SVM to predict the label based on the latent-space point $z$. The calculated conditional entropy (i.e. how surprising finding out the correct label is given the linear SVM's prediction) roughly translates to how well the binary attribute can be described as a linear subspace. 

#### _Creating "antifaces"_
By taking the average of $f(\bf{z})$ over the probability distribution $P(\bf{z}))$, we can work out the intermediate latent code $\overline{\bf{w}}$ that generates the "mean face". It has very interesting properties, such as looking straight onto the camera, and being of an indeterminate gender.

But we can do more. For any face $\bf{w}$, we can work out the "antiface" $\bf{w}'$ by reflecting it around $\overline{\bf{w}}$. This let's us generate the opposite of each face. It's interesting to note that various attributes such as gender, age, glasses, and looking direction all swap to their opposites in the antiface.

<center>
![_Creating the antiface_](/blog_posts/51_stylegan/images/Screen Shot 2022-05-18 at 11.37.30 pm.png){width=600px}
</center>

## Updates

_Since StyleGAN, there has been progressive updates to the paper. These can all be found in a blog here: [stylegan.xyz/code](https://www.stylegan.xyz/code){target="_blank"}_