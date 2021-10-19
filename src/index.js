// import "./styles.css";

// document.getElementById("app").innerHTML = `
// <h1>Hello Vanilla!</h1>
// <div>
//   We use the same configuration as Parcel to bundle this sandbox, you can find more
//   info about Parcel 
//   <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
// </div>
// `;

// let data = require("./data.json");

var appsList = [];
var filteredAppsList = [];

function addSearchListerns() {
    const source = document.getElementById('search-box');
    const inputHandler = function(e) {
        console.log(e.target.value);
        getAppsList(e.target.value);
    }

    source.addEventListener('input', inputHandler);
}

function getAppsList(searchText) {
    //reset search
    document.querySelector(".container").innerHTML = ""; //remove all children

    for (let i = 0; i < appsList.length; i++) {
        const item = appsList[i];

        if (searchText && searchText.length > 0) {
            if (!item.name.toLowerCase().includes(searchText)) {
                continue;
            }
        }

        var elem = document.createElement("div");

        //title-img
        var titleWrapper = document.createElement("div");
        titleWrapper.setAttribute("class", "title-container");

        //title-img
        var titleLabel = document.createElement("div");
        titleLabel.innerText = item.name.substring(0, 2).toUpperCase();
        titleLabel.setAttribute("class", "title-label");
        titleWrapper.appendChild(titleLabel);
        elem.appendChild(titleWrapper);

        var subCard = document.createElement("div");
        subCard.setAttribute("class", "sub-card");

        //title
        var title = document.createElement("h5");
        title.innerText = item.name;
        title.setAttribute("class", "title");
        subCard.appendChild(title);


        //description
        if (item.description.length > 0) {
            var description = document.createElement("p");
            description.innerText = item.description;
            subCard.appendChild(description);
        }

        elem.appendChild(subCard);


        //img
        var img = document.createElement("img");
        img.setAttribute("src", "./src/assets/drag-icon.png");
        img.setAttribute('class', "drag-icon");
        elem.appendChild(img);


        elem.setAttribute('id', item.id.toString());
        elem.setAttribute('class', "card");

        var app = document.createElement("div");
        app.appendChild(elem);
        app.setAttribute('draggable', true);
        app.setAttribute('class', "card-wrapper");

        document.querySelector(".container").appendChild(app);

        // document.querySelector(".container").appendChild(elem);
        // }
    }
}

function addNew() {
    let name = window.prompt("Enter AppName");
    if (name) {
        let description = window.prompt("Enter Description");
        appsList.push({ name, description, id: Math.random() })
        getAppsList();
        addDragAndDrpListerns();
    }
}

function initialsetup() {
    appsList = getDashboardData().results || [];
    getAppsList();
    addSearchListerns();
    addDragAndDrpListerns();
}

function addDragAndDrpListerns() {
    var dragSrcEl = null;

    function handleDragStart(e) {
        this.style.opacity = '0.4';

        dragSrcEl = this;

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        e.dataTransfer.dropEffect = 'move';

        return false;
    }

    function handleDragEnter(e) {
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }

        console.log(e);
        console.log(dragSrcEl);
        console.log(e.dataTransfer.getData('text/html'));

        if (dragSrcEl != this) {
            let sourceIndex = appsList.findIndex(item => item.id == dragSrcEl.children[0].id);
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
            let destinationIndex = appsList.findIndex(item => item.id == dragSrcEl.children[0].id);

            console.log(sourceIndex);
            console.log(destinationIndex);

            //swap
            const temp = appsList[sourceIndex];
            appsList[sourceIndex] = appsList[destinationIndex];
            appsList[destinationIndex] = temp;

            console.log(appsList);
        }
        return false;
    }

    function handleDragEnd(e) {
        this.style.opacity = '1';

        items.forEach(function(item) {
            item.classList.remove('over');
        });
    }


    let items = document.querySelectorAll('.container .card-wrapper');
    items.forEach(function(item) {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    });
}


document.addEventListener('DOMContentLoaded', (event) => {
    // var mydata = JSON.parse(data);
    // alert(mydata[0].name);

    initialsetup();
});

function getDashboardData() {
    return {
        "results": [{
                "name": "My GUS",
                "description": "An empty shell which gives you the ability to create your own navigation",
                "id": 1000
            },
            {
                "name": "Lightning Usage App",
                "description": "View Adoption and Usage Metrics for Lightning Experience",
                "id": 1001

            },
            {
                "name": "Lock the Line",
                "description": "Teams must not add new features to P$ or GIT when their bug stastistics are over defined thresholds. This...",
                "id": 1002
            },
            {
                "name": "Component Tracker",
                "description": "",
                "id": 1003
            },
            {
                "name": "Change Traffic Control",
                "description": "",
                "id": 1004
            },
            {
                "name": "Innovation & Learning",
                "description": "",
                "id": 1005
            },
            {
                "name": "CaPAD",
                "description": "",
                "id": 1006
            },
            {
                "name": "TREC",
                "description": "Trailhead Release App Console",
                "id": 1007
            },
            {
                "name": "Test Manager",
                "description": "An automated Test Reporting and Configuration Management tool",
                "id": 1008
            }
        ]
    }
}