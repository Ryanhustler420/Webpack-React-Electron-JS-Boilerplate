import { toast } from 'react-toastify';

class Toast {

    static bottom_center = class {

        static #queue = [];
        static #isRunning = false;
        static #types = { 'error': 'error', 'success': 'success', 'dark': 'dark' }
        static #OPTION = {
            position: "bottom-center",
            hideProgressBar: true,
            closeOnClick: false,
            progress: undefined,
            pauseOnHover: true,
            closeButton: false,
            draggable: true,
            autoClose: 2000,
        }

        static onOpenCB() { }
        static onCloseCB() { }
        static * requestQueue() { yield this.#queue.shift() }

        static stage(type = this.#types.success, message = 'A damn simple message', onOpenCB = this.onOpenCB, onCloseCB = this.onCloseCB) {
            const has = _.find(this.#queue, { message })
            if (!has) this.#queue.push({ type, message, onOpenCB, onCloseCB });
            if (this.#isRunning == false) {
                this.#isRunning = true;
                this.showNext();
            }
        }

        static showNext() {
            const o = this.requestQueue().next().value;
            if (o != undefined) {

                if (o?.type == this.#types['error']) this._error(o?.message, o.onOpenCB, () => { this.showNext(); o.onCloseCB(); });
                else if (o?.type == this.#types['dark']) this._dark(o?.message, o.onOpenCB, () => { this.showNext(); o.onCloseCB(); });
                else if (o?.type == this.#types['success']) this._success(o?.message, o.onOpenCB, () => { this.showNext(); o.onCloseCB(); });
                else this.#isRunning = false;

            } else this.#isRunning = false;
        }

        // please don't call this method directly, if called then please provide onOpenCB and onCloseCB callback functions as well
        static _error(message, onOpenCB, onCloseCB) {
            toast.error(message, {
                ...this.#OPTION,
                onOpen: () => onOpenCB(),
                onClose: () => onCloseCB(),
            })
        }

        // please don't call this method directly, if called then please provide onOpenCB and onCloseCB callback functions as well
        static _dark(message, onOpenCB, onCloseCB) {
            toast.dark(message, {
                ...this.#OPTION,
                onOpen: () => onOpenCB(),
                onClose: () => onCloseCB(),
            });
        }

        // please don't call this method directly, if called then please provide onOpenCB and onCloseCB callback functions as well
        static _success(message, onOpenCB, onCloseCB) {
            toast.success(message, {
                ...this.#OPTION,
                onOpen: () => onOpenCB(),
                onClose: () => onCloseCB(),
            });
        }

    }

    static top_right = class {
        // code...
    }

}

export { Toast };