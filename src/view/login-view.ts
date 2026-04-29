import type LoginController from "../controller/login-controller";

/**
 * View class loginView : Handles the UI for the Login screen
 * passes input to the controller (username and password, and login or register prompt)
 * listens for changes from the model
 * 
 */
export default class LoginView {
    #controller: LoginController;

    constructor(controller: LoginController) {
        this.#controller = controller;

        document.querySelector("#app")!.innerHTML = `
            <div id="login-screen">
                <h2>Login</h2>
                <input id="username" type="text" placeholder="Username"/>
                <input id="password" type="password" placeholder="Password"/>
                <button id="login-btn">Login</button>
                <button id="register-btn">Register</button>
                <div id="login-msg"></div>
            </div>
        `;

        //conneting to controller
        // taking in strings
        document.querySelector("#login-btn")!.addEventListener("click", async () => {
            const username = (document.querySelector("#username") as HTMLInputElement).value;
            const password = (document.querySelector("#password") as HTMLInputElement).value;
            await this.#controller.login(username, password);
        });

        document.querySelector("#register-btn")!.addEventListener("click", async () => {
            const username = (document.querySelector("#username") as HTMLInputElement).value;
            const password = (document.querySelector("#password") as HTMLInputElement).value;
            await this.#controller.register(username, password);
        });
    }

    showError(msg: string) {
        document.querySelector("#login-msg")!.textContent = msg;
    }

    showSuccess(msg: string) {
        document.querySelector("#login-msg")!.textContent = msg;
    }
}

