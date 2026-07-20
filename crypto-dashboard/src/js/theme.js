let initialized = false;


export function initializeTheme(){


    if(initialized){

        return;

    }


    initialized = true;



    const themeBtn =
    document.getElementById("themeBtn");



    const savedTheme =
    localStorage.getItem("theme");



    if(savedTheme === "dark"){

        document.body.classList.add("dark");

    }



    if(!themeBtn){

        console.log(
            "Theme button not found"
        );

        return;

    }




    themeBtn.addEventListener(

        "click",

        ()=>{


            document.body.classList.toggle(
                "dark"
            );



            const isDark =
            document.body.classList.contains(
                "dark"
            );



            localStorage.setItem(

                "theme",

                isDark
                ?
                "dark"
                :
                "light"

            );



            themeBtn.textContent =
            isDark
            ?
            "☀️"
            :
            "🌙";


        }

    );



    // Initial icon update

    themeBtn.textContent =
    document.body.classList.contains("dark")
    ?
    "☀️"
    :
    "🌙";


}