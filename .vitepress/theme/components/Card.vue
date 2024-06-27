<template>
    <div class="card">
        <img :src="imageUrl" alt="Card Image" />
        <div class="card-body">
            <h3>{{ title }}</h3>
            <p>{{ description }}</p>
        </div>
        <button @click="handleClick">{{ ButtonText }}</button>
    </div>
</template>
<script>
import { ref } from 'vue';
export default {
    setup(props) {
        const imageUrl = ref(props.imageUrl);
        const title = ref(props.title);
        const description = ref(props.description);
        const LinkUrl = ref(props.LinkUrl);
        const ButtonText = ref(props.ButtonText);
        function handleClick() {
            location.assign(LinkUrl.value);
        }
        return {
            imageUrl,
            title,
            description,
            LinkUrl,
            handleClick,
            ButtonText
        };
    },
    props: {
        imageUrl: {
            type: String,
            required: true
        },
        title: {
            type: String,
            default: 'Card Title'
        },
        description: {
            type: String,
            default: 'This is a card component'
        },
        LinkUrl: {
            type: String,
            default: '/'
        },
        ButtonText: {
            type: String,
            default: 'Go!'
        },
    }
};
</script>
<style>
.card {
    border: 5px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
    margin: 10px;
    width: 200px;
    height: 250px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

@keyframes img-transform {
    0% {
        transform: translateX(-50px) scale(80%);
    }

    50% {
        transform: translateX(0px) scale(100%);
    }

    100% {
        transform: translateX(50px) scale(80%);
    }
}


.card img {
    clear: both;
    display: block;
    margin: auto;
    width: 100px;
    height: 100px;
    object-fit: cover;
    animation: 5s linear 0s infinite img-transform;
    animation-direction: alternate;
}

.card-body {
    padding: 15px;
    height: 100px;
}

.card-body h3 {
    margin: 0 0 10px 0;
}

.card button {
    padding: 5px 10px;
    background-color: #00a2ff;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    bottom: 0;
    display:block;
    margin-left: auto;
    margin-right: 5px;
    margin-top: 0px;
}
</style>