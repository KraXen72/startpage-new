//TODO update these settings' values when i load the json from localstorage (before generating load from localstorage)
const settings = {
    s:{ //TODO change this to an array maybe??
        TXT_TITLE: { title:"Settings",type:'heading' },
        connect: { title:`Connect columns`,desc:`connects link columns together`,type:'bool',key:'connect',classes:['connect',''] },
        compact: { title:`Compact links`,desc:`make links not take up as much space`,type:'bool',key:'compact',classes:['compact',''] },
        leftpic: { title:`Move Image to left`,desc:`Move image to left instead of top.`,type:'bool',key:'leftpic',classes:['leftpic',''] },
        tallpic: {title:`Portrait left image`,desc:`(if Image is on the left) make the image portrait`,type:'bool',key:'tallpic',classes:['tallpic',''] },
        slim: { title:`Slim container`,desc:`max width of container is now 32rem instaed of 40rem`,type:'bool',key:'slim',classes:['slim','']},
        thicc: { title:`Thicc container`,desc:`max width of container is now 55rem instaed of 40rem`,type:'bool',key:'thicc',classes:['thicc','']},
        cols: { title:`Number of columns`,desc:`How many columns to show: either 2 or 3`,type:'sel',opts:[3,2],key:'cols',classes:['cols-3','cols-2'] },
        verdana: { title:`Use Verdana font`,desc:`Use Verdana font instead of Roboto`,type:'bool',key:'verdana',classes:['verdana',''] },
        TXT_HIDING: { title:"Hiding elements",type:'heading' },
        nosearch: { title:`Hide Search`,desc:'',type:'bool',key:'nosearch',classes:['nosearch',''] },
        nopic: { title:`Hide Image`,desc:'',type:'bool',key:'nopic',classes:['nopic',''] },
        notitle: { title:`Hide Title`,desc:'',key:'notitle',type:'bool',classes:['notitle',''] },
        nogreeting: { title:`Hide Greeting`,desc:'',key:'nogreeting',type:'bool',classes:['nogreeting',''] },
        
    },
    l: { //links
        col1: [
            {name:"gmail",url:"https://mail.google.com/mail/u/0/#inbox"},
            {name:"outlook",url:"https://outlook.sk"},
            {name:"r/unixpron",url:"https://www.reddit.com/r/unixporn/"},
            {name:"r/mk",url:"https://www.reddit.com/r/MechanicalKeyboards/"},
            {name:"monkeytype",url:"https://monkeytype.com/"},
            {name:"rosebox",url:"https://github.com/KraXen72/rosebox"},
            {name:"krunker market",url:"https://www.krunker.io/social.html"},
            {name:"yeehow item list",url:"https://yee.how/item-list/"}
        ],
        col2: [
            {name:"github",url:"https://github.com/"},
            {name:"mod forum",url:"https://forum.vivaldi.net/category/52/modifications"},
            {name:"trello",url:"https://trello.com/kraxen7/boards"},
            {name:"pcmskin3d",url:"https://www.planetminecraft.com/pmcskin3d/"},
            {name:"keybr",url:"https://www.keybr.com/"},
            {name:"planningcenter",url:"https://services.planningcenteronline.com/dashboard"},
            {name:"wallpaper collection",url:"https://mega.nz/folder/PpohCIpT#tII4Q60AFpgfnEYFywwlow"},
            {name:"catus airsoft",url:"https://catus.sk"}
        ],
        col3: [
            {name:"link 1",url:"#"},
            {name:"link 2",url:"#"},
            {name:"link 3",url:"#"},
            {name:"link 4",url:"#"},
            {name:"link 5",url:"#"},
        ]
    }
}

//update from localstorage here
let ls_settings = localStorage.getItem('links')

//this will only update links tho...
if (typeof ls_settings !== 'undefined' && ls_settings !==  null) {
    let parsed = JSON.parse(ls_settings)
    console.log("found data in localStorage, loading settings: ", parsed)
    Object.assign(settings, {l: parsed}) //update the current settings object with the one from localstorage
}

/**
 * creates a new Setting element
 */
class SettingElem {
    //s-update is the class for element to watch
    constructor (props) {
        /**
         * is the key to get checked when writing an update, for checkboxes it's checked, for selects its value etc. 
         * @type {String} 
         */
        this.updateKey = ''

        /**
         * is the eventlistener to use. for checkbox its be onclick, for select its be onchange etc.
         * @type {String}
         */
        this.updateMethod = ''

        /**
         * save the props from constructor to this class (instance)
         * @type {Object}
         */
        this.props = props

        /**
         * type of this settingElem, can be {'bool' | 'sel' | 'heading'}
         * @type {String} 
         */
        this.type = props.type

        /**
         * if this setting actually changes something and can be updated. titles are immutable
         * @type {Boolean}
         */
        this.mutable = false


        /**
         * innerHTML for settingElement
         * @type {String}
         */
        this.HTML = ''

        switch (props.type) {
            case 'bool':
                this.HTML = `<span class="setting-title" title="${props.desc}">${props.title}</span> 
                <label class="switch">
                    <input class="s-update" type="checkbox" ${props.value ? "checked":""}/>
                    <div class="slider round"></div>
                </label>`
                if (!!props.desc && props.desc !== "") {
                    this.HTML += `<span class="setting-desc" title="${props.desc}">?</span>`
                }
                this.mutable = true
                this.updateKey = `checked`
                this.updateMethod = 'onchange'
                break;
            case 'heading':
                this.HTML = `<h1 class="setting-title">${props.title}</h1>`
                this.mutable = false
                break;
            case 'sel':
                this.HTML = `<span class="setting-title" title="${props.desc}">${props.title}</span> 
                <label class="switch">
                    <select class="s-update">${
                        props.opts.map( o => `<option value ="${o}">${o}</option>`).join("") /* create option tags*/
                    }</select>
                </label>`
                if (!!props.desc && props.desc !== "") {
                    this.HTML += `<span class="setting-desc" title="${props.desc}">?</span>`
                }
                this.mutable = true
                this.updateKey = `value`
                this.updateMethod = 'onchange'
                break;
            default:
                this.HTML = `<span class="setting-title">${props.title}</span><span>Unknown setting type</span>`
                this.mutable = false
        }
    }
    //this reflects the changes on the actual layout
    /**
     * update the layout through updating global container object
     * @param {{elem: Element, callback: 'normal'|Function}} elemAndCb
     */
    set update({elem, callback}) {
        let target = elem.getElementsByClassName('s-update')[0]
        let value = target[this.updateKey]
        
        //console.log(`dry run: would update '${this.props.key}' to '${value}'`)
        if (callback === 'normal') {
            Container.p[this.props.key] = value //update the main container object that is bound to layout
        } else {
            callback()
        }
        
    }

    /**
     * this initializes the element and its eventlisteners. 
     * @returns {Element}
    */
    get elem() { 
        // i only create the element after .elem is called so i don't pollute the dom with virutal elements when making settings
        let w = document.createElement('div') //w stands for wrapper
        w.classList.add("setting")
        w.id = `settingElem-${this.props.key}`
        w.classList.add(this.type) //add bool or title etc
        w.innerHTML = this.HTML

        if (this.type === 'sel') { w.querySelector('select').value = this.props.value } //select value applying is fucky so like fix it i guess

        //add an eventlistener if the setting is mutable
        if (this.mutable) {
            w[this.updateMethod] = () => {
                this.update = {elem: w, callback: 'normal'}
            }
        }
        return w //return the element
    }
}

/**
 * initialize settings elements. only call after DOM init. only call once.
 */
function initsettings() {
    //add value key to all settings from the container (after container is initialized)
    for (let i = 0; i < Object.keys(settings.s).length; i++) {
        const setting = settings.s[Object.keys(settings.s)[i]];

        if (setting.type === 'bool' || setting.type === 'sel') {
            setting.value = Container.p[setting.key]
        }   
    }

    //generate the setting elements
    for (let i = 0; i < Object.keys(settings.s).length; i++) {
        const key = Object.keys(settings.s)[i];
        const val = settings.s[key]

        let set = new SettingElem(val)
        document.getElementById("layout-settings").appendChild(set.elem)
    }
    
    //generate sortable links
    //load links into columns - repeat once for every column
    let Sortables = []
    for (let i = 0; i < Object.keys(settings.l).length; i++) {
        loadlinks(`sortable-col${i+1}`, settings.l[`col${i+1}`], 'config')
        let col = document.getElementById(`sortable-col${i+1}`)
        let sort = new Sortable(col, {
            group: 'shared',
            animation: 150,
            handle: '.link-text',
            ghostClass: 'links-ghost'
        })
        Sortables.push(sort)
    }

    //add links submit form
    const addlink = document.getElementById('add-link')
    addlink.onsubmit = (event) => {
        event.preventDefault()
        const formData = new FormData(addlink);
        const entries = formData.entries();
        const data = Object.fromEntries(entries);

        addlink.querySelectorAll(`input.rb-input`).forEach(input => {input.value = ""}) //clear the values

        link = new LinkElem(data["link-name"], data['link-url'], 'config')
        let fewestChildrenColumnSelector = getFewestChildren(['#sortable-col1','#sortable-col2','#sortable-col3'])
        console.log(fewestChildrenColumnSelector)
        document.querySelector(fewestChildrenColumnSelector).appendChild(link.elem)
    }

    //serialize settings for links and  save them to localstorage
    document.getElementById('links-save').onclick = () => {
        let sortableElements = Sortables.map(s => s.el)
        let content = sortableElements.map(el => {
            return serializeSortable(el)
        })
        let finalobj = {
            col1: content[0],
            col2: content[1],
            col3: content[2]
        }
        console.log(finalobj)
        Object.assign(settings, {l: finalobj})
        localStorage.setItem('links', JSON.stringify(finalobj))

        //yeet all the links
        let linkstodel = document.querySelector('.colwrap').getElementsByClassName('links')
        linkstodel = [...linkstodel]
        linkstodel.forEach(link => link.remove());
        initlinks() //load them again
  
        //save layout
        let saveme = serializeContainer()
        saveme = saveme.p
        console.log(saveme)
        localStorage.setItem('Container', JSON.stringify(saveme))

        //save classlist
        let classList = [...document.getElementById('container').classList].join(' ')
        localStorage.setItem('classList', classList)
    }

    console.log("sucessfully generated settings")
}

/**
 * pass an array of queryselectors, get the one with fewest children back
 */
function getFewestChildren(selectorArray) {
    const children = selectorArray.map(selector => {
        return {selector, children: document.querySelector(selector).children.length}
    })

    children.sort((a, b) => { //sort from smallest to biggest
        return a.children - b.children
    })

    return children[0].selector;
}

/**
 * provided a html element that is a valid sortable, this will parse all its children, get the values and return an object
 * @param {Element} SortableElem the Element that is a valid sortable
 * @returns {Object} object in the same structure as settings.l
 */
function serializeSortable(SortableElem) {
    let children = [...SortableElem.children]
    let content = children.map(span => {
        return {name: span.querySelector('.link-text').textContent, url: span.href}
    })
    return content
}

