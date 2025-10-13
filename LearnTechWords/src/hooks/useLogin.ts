import { ref } from 'vue'


export default function () {
    let num1 = ref(1)

    function add() {
        num1.value++
    }

    return { num1, add }
}
