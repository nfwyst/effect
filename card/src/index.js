import './index.scss'
import template from './template'


class Model {
  constructor(lastId = 0, cards = []) {
    this.lastId = lastId
    this.cards = cards
  }
}

class View {
  constructor () {
    document.querySelector('.add-card').onclick = () => {
      controller.addCard() 
    }

    this.cardList = document.querySelector('.card-list')
    this.cardTemplate = template

    this.cardList.onclick = e => {
      let target = e.target;
      if(target.className === 'remove-card') {
        controller.removeCard(target.parentElement.parentElement.dataset)
      }
    }

    this.render()
  }

  render() {
    let cardList = this.cardList
    let cardTemplate = this.cardTemplate

    cardList.innerHTML = ''
    controller.getVisibleCards().forEach(card => {
      cardList.insertAdjacentHTML('afterbegin', cardTemplate.replace(/{{id}}/g, card.id))
    })
  }
}

class Controller {
  addCard () {
    let id = ++model.lastId;

    model.cards.push({
      id,
      visible: true
    })
    view.render()
  }

  removeCard (card) {
    let targetCard = model.cards[ card.id - 1 ]
    targetCard.visible = false
    view.render()
  }

  getVisibleCards () {
    return model.cards.filter((card) => card.visible)
  }
}

var model = new Model()
var controller = new Controller()
var view = new View()
