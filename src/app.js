const template = document.createElement('template');
template.innerHTML = `
  <style>
  </style>
  <link rel=stylesheet href="/src/styles.css">

  <div class="dashboard-container">
      <div class="header">
      <div class="sub-header">
          <h4>App Launcher</h4>
          <input type="text" name="search" id="search-box" style="max-width: 500px;" class="search-box" placeholder="Search apps or items...">
      </div>
      <button class="add-button" id="add-button">Add New</button>
    </div>
    <div class="container">
    </div>
  </div>
`;

class DashboardCard extends HTMLElement {
    appsList = [];

    constructor() {
        super();

        this.showInfo = true;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.initialsetup();
    }

    initialsetup() {
        this.readTextFile("/src/data.json", (text) => {
            var data = JSON.parse(text);
            this.appsList = data.results;

            this.getAppsList();
            this.addListerns();
            this.addDragAndDrpListerns();
        });
    }

    //#region API calls
    readTextFile(file, callback) {
            var rawFile = new XMLHttpRequest();
            rawFile.overrideMimeType("application/json");
            rawFile.open("GET", file, true);
            rawFile.onreadystatechange = function() {
                if (rawFile.readyState === 4 && rawFile.status == "200") {
                    callback(rawFile.responseText);
                }
            }
            rawFile.send(null);
        }
        //#endregion

    addListerns() {
        const source = this.shadowRoot.getElementById('search-box');
        const inputHandler = (e) => {
            console.log(e.target.value);
            this.getAppsList(e.target.value);
        }

        source.addEventListener('input', inputHandler);

        const addBtn = this.shadowRoot.getElementById('add-button');
        addBtn.addEventListener('click', () => {
            let name = window.prompt("Enter AppName");
            if (name) {
                let description = window.prompt("Enter Description");
                this.appsList.push({ name, description, id: Math.random() })
                this.getAppsList();
                this.addDragAndDrpListerns();
            }
        });

    }

    getAppsList(searchText) {
        //reset search
        this.shadowRoot.querySelector(".container").innerHTML = ""; //remove all children

        for (let i = 0; i < this.appsList.length; i++) {
            const item = this.appsList[i];

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

            this.shadowRoot.querySelector(".container").appendChild(app);

            // document.querySelector(".container").appendChild(elem);
            // }
        }
    }

    addDragAndDrpListerns() {
        var dragSrcEl = null;
        var that = this;

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

            if (dragSrcEl != this) {
                let sourceIndex = that.appsList.findIndex(item => item.id == dragSrcEl.children[0].id);
                dragSrcEl.innerHTML = this.innerHTML;
                this.innerHTML = e.dataTransfer.getData('text/html');
                let destinationIndex = that.appsList.findIndex(item => item.id == dragSrcEl.children[0].id);

                //swap
                const temp = that.appsList[sourceIndex];
                that.appsList[sourceIndex] = that.appsList[destinationIndex];
                that.appsList[destinationIndex] = temp;

            }
            return false;
        }

        function handleDragEnd(e) {
            this.style.opacity = '1';

            items.forEach(function(item) {
                item.classList.remove('over');
            });
        }


        let items = this.shadowRoot.querySelectorAll('.container .card-wrapper');
        items.forEach(function(item) {
            item.addEventListener('dragstart', handleDragStart, false);
            item.addEventListener('dragenter', handleDragEnter, false);
            item.addEventListener('dragover', handleDragOver, false);
            item.addEventListener('dragleave', handleDragLeave, false);
            item.addEventListener('drop', handleDrop, false);
            item.addEventListener('dragend', handleDragEnd, false);
        });
    }

    disconnectedCallback() {}

}



window.customElements.define('app-component', DashboardCard);