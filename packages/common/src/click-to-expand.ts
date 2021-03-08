// Depends on engrid-click-to-expand.scss to work
// Works when the user has adds ".click-to-expand" as a class to any field
export class ClickToExpand {
    clickToExpandWrapper = document.querySelectorAll('div.click-to-expand') as NodeListOf<HTMLElement>;
    
    constructor() {
        if (this.clickToExpandWrapper.length) {
            this.clickToExpandWrapper.forEach((element: HTMLElement) => {
                const content = element.innerHTML;
                const wrapper_html = '<div class="click-to-expand-cta"></div><div class="click-to-expand-text-wrapper" tabindex="0">' + content + '</div>';
                element.innerHTML = wrapper_html;
                element.addEventListener("click", event => {
                    if(event){
                        console.log("A click-to-expand div was clicked");
                        element.classList.add("expanded");
                    }
                });

                element.addEventListener("keydown", event => {
                    if ((event as KeyboardEvent).key === 'Enter') {
                        console.log("A click-to-expand div had the 'Enter' key pressed on it");
                        element.classList.add("expanded");
                    } else if ((event as KeyboardEvent).key === ' '){
                        console.log("A click-to-expand div had the 'Spacebar' key pressed on it");
                        element.classList.add("expanded");
                        event.preventDefault(); // Prevents the page from scrolling
                        event.stopPropagation() // Prevent a console error generated by LastPass https://github.com/KillerCodeMonkey/ngx-quill/issues/351#issuecomment-476017960
                    }
                  });
            });
        }
    }
}