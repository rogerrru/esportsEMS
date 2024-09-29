const names = [
    [
        {
            f_name: "Dyna",
            l_name:"Bullong",
            email: "2221002@slu.edu.ph",

        }
    ],
    [
        {
            f_name: "Chris",
            l_name:"Celedio",
            email: "2212038@slu.edu.ph",
            
        }
    ],
    [
        {
            f_name: "Roger",
            l_name:"Chegyem",
            email: "2223481@slu.edu.ph",
            
        }
    ],
    [
        {
            f_name: "Alexcious",
            l_name:"Decena",
            email: "2221089@slu.edu.ph",
            
        }
    ],
    [
        {
            f_name: "Alastair",
            l_name:"De Guzman",
            email: "2215424@slu.edu.ph",
            
        }
    ],
    [
        {
            f_name: "Aliyah",
            l_name:"Javier",
            email: "2223075@slu.edu.ph",
            
        }
    ],
    [
        {
            f_name: "",
            l_name:"",
            email: "",

        }
    ],
    [
        {
            f_name: "Simchoni",
            l_name:"Payad",
            email: "2215161@slu.edu.ph",
            
        }
    ]
]
 function loadSupport(){
    const teamNames = document.createElement('ul');
    teamNames.className = 'indie-profile-container';
    const nameContainer = document.querySelector(".name-container");
     names.forEach(person => {
         const listItem = document.createElement('li');
         listItem.className = 'names';
         listItem.innerHTML = `
            <a class="${person[0].f_name}">
                <img src="/assets/media/stud_pics/${person[0].l_name}.png" alt="">
                <h1>${person[0].f_name} ${person[0].l_name}</h1>
                <p>${person[0].email}</p>
            </a>
        `;
         teamNames.appendChild(listItem);
     });

     nameContainer.appendChild(teamNames);
 }
 loadSupport()
function changeBackgroundImage(imageUrl) {
    const body = document.body;
    body.style.backgroundImage = `url(${imageUrl})`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundAttachment = 'fixed';
}
changeBackgroundImage("#fafafa");

var accordions = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < accordions.length; i++) {
    accordions[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}