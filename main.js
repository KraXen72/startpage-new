let toggle, settbtn, containerElem

const containerObj = {
    p: { //props
        connect: false, //.connect: connects links together
        compact: false, //.compact: make links compact
        slim: false, //.slim: max width is now 32rem instaed of 40rem
        thicc: false, //.thicc max width is now 55rem instead of 40rem
        cols: 3, //.cols-2 || .cols-3: show either 1,2,3 or just 1,2 columns
        verdana: false, //.verdana: use verdana font
        nosearch: false, //.nosearch: hide search bar
        nopic: false, //.nopic: hide pic
        notitle: false, //.notitle: hide category titles
        nogreeting: true, //.nogreeting:	hide greeting
        leftpic: false, //.leftpic: put the pic to the left instead of top
        tallpic: false //.tallpic: pic will be yahallo (358*279.72px) tall and wide (only works with leftpic)
    }
}

let ls_containerObj = localStorage.getItem('Container')

//this will only update settings
if (typeof ls_containerObj !== 'undefined' && ls_containerObj !==  null) {
    let parsed = JSON.parse(ls_containerObj)
    console.log("found data in localStorage, loading Container: ", parsed)
    Object.assign(containerObj, {p: parsed}) //update the current container object with the one from localstorage
}

/**
* Container is the main object for layout; if you change its props, the layout instantly updates.
*/

const Container = Observable.from(containerObj)
Container.observe(changes => {
    changes.forEach(change => {
        if (change.path[0] === "p") {
            key = change.path[1]
            //console.log(`detected ${change.type} in '${key}': `, change)

            if (key === "cols") {
                //if its not 2 or 3 just dont change anything
                change.value = [2,3].includes(change.value) ? change.value : Container.p.cols

                let cl = [...containerElem.classList] //backup classlist
                cl[1] = `cols-${change.value}`
                containerElem.classList = cl.join(" ") //reconstruct classlists
            } else {
                //if new value is true, add the class otherwise remove the class 
                if (change.value === true) {
                    containerElem.classList.add(key)
                } else {
                    containerElem.classList.remove(key)
                }

                //make tallpic not work when leftpic is off & update the checkboxes in settings
                if (key === "leftpic" && !change.value) { 
                    Container.p.tallpic = false; 
                    document.getElementById("settingElem-tallpic").querySelector(".s-update").checked = false;
                }
                if (key === "tallpic" && change.value && !Container.p.leftpic) {
                    Container.p.tallpic = false;
                    setTimeout(() => {document.getElementById("settingElem-tallpic").querySelector(".s-update").checked = false;}, 150)
                }
            }
        } else if (change.path.length === 1 && change.type === "insert") {
            console.log("unsupported change, reverting.")
            delete Container[change.path[0]]
        } else {
            if (!change.type === "delete") {
                console.warn(`you assigned some random bs deep in the object and its not a prop, that's on you man`)
            }
        }
    }) //cols-2 leftpic tallpic slim verdana nosearch notitle compact connect
})

/**
 * creates a new Link element (initialization creates the dom element)
 */
 class LinkElem {
    /**
     * creates the link dom element.
     * @param {String} name label of the link
     * @param {String} url url/href of the link
     * @param {'normal'|'config'} mode what type of links you need
     */
    constructor(name, url, mode) {
        let normal = mode === 'normal'
        /**
         * some properties that will later get assigned to the element
         * @type {Object}
         */
        this.elemProps = {} 

        /**
         * string to be passed into createElement, for normal mode it's a, for config it's span
         */
        this.elemStr = normal ? 'a' : 'span'

        this.elemProps = {
            href: url, //href don't work on span anyway
            title: name,
            target: '_self',//normal ? '_blank' : '_self',
            classList: "links",
            draggable: false,
            innerHTML: `<span class="accent">${normal ? "~" : '&times;'}</span>
            <span class="link-text">${name}</span>`
        }
    }
    /**
     * get the link element
     */
    get elem() {
        let w = document.createElement(this.elemStr)
        Object.assign(w, this.elemProps)
        w.querySelector('span.accent').onclick = () => {
            if (window.confirm(`Really delete '${this.elemProps.title}'?`)) {
                w.remove()
            }
        } //yeet the thing on span.accent onclick

        return w
    }
}

//TODO instangly update classlist from json, not through this for loop - save classList and Container separately

document.addEventListener('DOMContentLoaded', () => {
    toggle = document.getElementById('toggle');
    settbtn = document.getElementById('settings');

    containerElem = document.getElementById('container')

    toggle.onclick = toggleImage
    settbtn.onclick = toggleSettings

    let ls_classList = localStorage.getItem('classList')

    //this will only update settings
    if (typeof ls_classList !== 'undefined' && ls_classList !==  null) {
        console.log("found data in localStorage, loading classList: ", ls_classList)
        containerElem.classList = ls_classList
    }

    initlinks()
    initsettings()
})

function initlinks() {
    for (let i = 0; i < Object.keys(settings.l).length; i++) {
        loadlinks(`col-${i+1}`, settings.l[`col${i+1}`], 'normal')
    }
}

/**
 * load links into an element. 
 * @param {String} id getelementbyid id for the column to insert to
 * @param {Object} db settigns.l.col1 for example
 * @param {'normal'|'config'} mode what type of link you need
 */
 function loadlinks(id, db, mode) {
    for (let i = 0; i < Object.keys(db).length; i++) {
        const key = Object.keys(db)[i];
        const val = db[key]

        let link = ''
        link = new LinkElem(val.name, val.url, mode)
        document.getElementById(id).appendChild(link.elem)
    }
}

/**
 * gets the values of global Container object (which is actually a Proxy)
 * @returns {Object} current Container configuration
 */
function serializeContainer() {
    let keys = Object.keys(Container.p)
    let saveme = {p: {}}

    keys.forEach(key => {
        let val = Container.p[key]
        saveme.p[key] = val
    })

    return saveme
}

/**
 * toggle the image visible or hidden
 */
function toggleImage() {
    document.getElementById('settingElem-nopic').querySelector('.s-update').click()
    document.getElementById('links-save').click()
}

/**
 * toggle the visibility of settings screen
 */
function toggleSettings() {
    document.getElementById('settings-screen').classList.toggle('hidden')
}