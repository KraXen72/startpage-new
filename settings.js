//TODO update these settings' values when i load the json from localstorage (before generating load from localstorage)
const settings = {
    s:[ //TODO change this to an array maybe??
        { title:"Settings",type:'heading',key:"settingTitle" },
        { title:`Connect columns`,desc:`connects link columns together`,type:'bool',key:'connect',classes:['connect',''] },
        { title:`Compact links`,desc:`make links not take up as much space`,type:'bool',key:'compact',classes:['compact',''] },
        { title:`Move Image to left`,desc:`Move image to left instead of top.`,type:'bool',key:'leftpic',classes:['leftpic',''] },
        { title:`Portrait left image`,desc:`(if Image is on the left) make the image portrait`,type:'bool',key:'tallpic',classes:['tallpic',''] },
        { title:`Slim container`,desc:`max width of container is now 32rem instaed of 40rem`,type:'bool',key:'slim',classes:['slim','']},
        { title:`Thicc container`,desc:`max width of container is now 55rem instaed of 40rem`,type:'bool',key:'thicc',classes:['thicc','']},
        { title:`Number of columns`,desc:`How many columns to show: either 2 or 3`,type:'sel',optType: Number, opts:[3,2],key:'cols',classes:['cols-3','cols-2'] },
        { title:`Use Verdana font`,desc:`Use Verdana font instead of Roboto`,type:'bool',key:'verdana',classes:['verdana',''] },
        { title:"Hiding elements",type:'heading',key:"hidingTitle" },
        { title:`Hide Search`,desc:'',type:'bool',key:'nosearch',classes:['nosearch',''] },
        { title:`Hide Image`,desc:'',type:'bool',key:'nopic',classes:['nopic',''] },
        { title:`Hide Title`,desc:'',key:'notitle',type:'bool',classes:['notitle',''] },
        { title:`Hide Greeting`,desc:'',key:'nogreeting',type:'bool',classes:['nogreeting',''] },
        { title:`Misc`,type:'heading',key:"miscTitle"},
        { title:`Make settings & toggle buttons incognito`,desc:'make the small settings & toggle buttons invisible & only appear on hover',key:'incognito',type:'bool',classes:['incognito',''], updateCallback: 'misc' },
        { title:`Greeting text:`,key:'greeting',type:'text',updateCallback: 'misc',value: 'heya'},
        { title:`1st column title:`,key:'col1Title',type:'text',updateCallback: 'misc', value: 'links' },
        { title:`2nd column title:`,key:'col2Title',type:'text',updateCallback: 'misc', value: 'social' },
        { title:`3rd column title:`,key:'col3Title',type:'text',updateCallback: 'misc', value: 'other' }
    ],
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
    },
    m: { //misc
        incognito: false,
        greeting: 'heya',
        col1Title: 'links',
        col2Title: 'social',
        col3Title: 'other'
    }
}
var Sortables = []

//update from localstorage here
let ls_settings = localStorage.getItem('links')
let ls_misc = localStorage.getItem('miscSettings')

//this will only update links & misc settings
if (typeof ls_settings !== 'undefined' && ls_settings !==  null) {
    let parsed = JSON.parse(ls_settings)
    console.log("found data in localStorage, loading settings: ", parsed)
    Object.assign(settings.l, parsed) //update the current settings object with the one from localstorage
}
if (typeof ls_misc !== 'undefined' && ls_misc !==  null) {
    let parsed = JSON.parse(ls_misc)
    console.log("found data in localStorage, loading miscSettings: ", parsed)
    Object.assign(settings.m, parsed) //update the current settings object with the one from localstorage
}

/**
 * creates a new Setting element
 */
class SettingElem {
    //s-update is the class for element to watch
    constructor (props) {
        /**@type {String} is the key to get checked when writing an update, for checkboxes it's checked, for selects its value etc.*/
        this.updateKey = ''
        /**@type {String} is the eventlistener to use. for checkbox its be onclick, for select its be onchange etc. */
        this.updateMethod = ''
        /** @type {Object} save the props from constructor to this class (instance) */
        this.props = props
        /** @type {String} type of this settingElem, can be {'bool' | 'sel' | 'heading' | 'text'} */
        this.type = props.type
        /** @type {Boolean} if this setting actually changes something and can be updated. titles are immutable */
        this.mutable = false
        /** @type {String} innerHTML for settingElement */
        this.HTML = ''
        /** @type {Number | String} (only for 'sel' type) if Number, parseInt before assigning to Container */
        this.optType = ''
        /** @type {Function | 'misc' | 'normal'} custom callback for update function. 'misc' is for misc settings if nothing then default is 'normal' */
        this.updateCallback = props.updateCallback || 'normal'

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
                this.optType = props.optType
                break;
            case 'text':
                this.HTML = `<span class="setting-title">${props.title}</span><span>
                    <input type="text" class="rb-input s-update" name="${props.key}" autocomplete="off" placeholder="${props.value}">
                </span>
                `
                this.mutable = true
                this.updateKey = `value`
                this.updateMethod = `oninput`
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
            //update the main container object that is bound to layout
            if (this.optType !== '' && this.optType === Number) {
                Container.p[this.props.key] = parseInt(value) 
            } else {
                Container.p[this.props.key] = value
            }
            //saveSettings()
        } else if (callback === 'misc') {
            //misc settings
            settings.m[this.props.key] = value
        } else { //this adds support for custom callbacks (custom settings)
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
                this.update = {elem: w, callback: this.updateCallback}
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
    for (let i = 0; i < settings.s.length; i++) {
        const setting = settings.s[i];

        if (setting.type !== 'heading') {
            if (typeof setting.updateCallback !== 'undefined' && setting.updateCallback === 'misc') {
                console.log(setting.key, settings.m[setting.key])
                setting.value = settings.m[setting.key]
            } else {
                setting.value = Container.p[setting.key]
            }
        }   
    }

    //generate the setting elements
    for (let i = 0; i < settings.s.length; i++) {
        const val = settings.s[i]

        let set = new SettingElem(val)
        document.getElementById("layout-settings").appendChild(set.elem)
    }
    
    //generate sortable links
    //load links into columns - repeat once for every column
    Sortables = []
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

    //add onclick listeners for saving
    [...document.getElementsByClassName('hook-save-btn')].forEach(btn => {btn.onclick = saveSettings})

    //backup
    document.getElementById('export-json').onclick = exportJson
    document.getElementById('import-json').onclick = importJson

    console.log("sucessfully generated settings")
}

/**
 * saves settings in localstorage. requires settings to be initialized and Sortables array to be populated.
 */
function saveSettings() {
    //save links
    let content = Sortables.map(s => s.el).map(el => serializeSortable(el))
    let finalobj = {
        col1: content[0],
        col2: content[1],
        col3: content[2]
    }
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
    localStorage.setItem('Container', JSON.stringify(saveme))

    //save classlist
    let classList = [...document.getElementById('container').classList].join(' ')
    localStorage.setItem('classList', classList)

    //save misc
    localStorage.setItem('miscSettings', JSON.stringify(settings.m))

    console.log('saved')
    blinkElem("#savedmsg") //show saved message
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

/**
 * serialize links, container and classList, stringify and fill in the export input
 */
function exportJson() {
    let exportObj = { links: {}, Container: {}, classList: "", type: "valid-startpage-backup" }

    //add links
    let content = Sortables.map(s => s.el).map(el => serializeSortable(el))
    exportObj.links = {
        col1: content[0],
        col2: content[1],
        col3: content[2]
    }

    //add settings/Container
    let saveme = serializeContainer()
    saveme = saveme.p
    exportObj.Container = saveme

    //add classlist
    exportObj.classList = [...document.getElementById('container').classList].join(' ')

    //misc settings
    exportObj.miscSettings = settings.m

    document.getElementById('export-json').previousElementSibling.value = JSON.stringify(exportObj)
}

/**
 * import a valid string (stringified object) as settings + links, save to localstorage & refresh
 */
function importJson() {
    let input = document.getElementById('import-json').previousElementSibling
    try {
        let val = JSON.parse(input.value)
        if (val.type === "valid-startpage-backup") {
            localStorage.setItem('links', JSON.stringify(val.links))
            localStorage.setItem('Container', JSON.stringify(val.Container))
            localStorage.setItem('classList', val.classList)
            localStorage.setItem('miscSettings', JSON.stringify(val.miscSettings))

            window.location.reload()
        } else {
            throw "not a valid backup";
        }
    } catch(e) {
        console.error(e)
        alert("not a valid backup !")
        input.value = ""
    }

}