import { Component } from '@angular/core';

const todos = [
  { id: 1, title: '吃饭', done: true },
  { id: 2, title: '睡觉', done: false },
  { id: 3, title: '打豆豆', done: true }
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public todos: {
    id: number,
    title: string,
    done: boolean
  }[] = JSON.parse(window.localStorage.getItem('todos') || '[]') 


  public visibility: string = 'all'


  public currentEd: {
    id: number,
    title: string,
    done: boolean
  } = null


  get filterTodos() {
    if (this.visibility === 'all') {
      return this.todos
    } else if (this.visibility === 'active') {
      return this.todos.filter(t => !t.done)
    } else if (this.visibility === 'completed') {
      return this.todos.filter(t => t.done)
    }
  }

  // 输入框添加数据
  addTodo(e): void {
    const titleText = e.target.value
    e.target.value = ''
    if (!titleText.length) {
      return
    }
    const last = this.todos[this.todos.length - 1]
    this.todos.push({
      id: last ? last.id + 1 : 1,
      title: titleText,
      done: false
    })
  }

  // 全部完成时全选按钮的状态
  // get set 中 toggleAll只是一个属性
  // get 访问时会调用
  // set 赋值时会调用
  // <input (change)="toggleAll = $event.target.checked" [checked]="toggleAll">
  get toggleAll() {
    // every 检测一个数组 一旦有不符合条件的马上返回false
    return this.todos.every(t => t.done)
  }

  set toggleAll(val) {
    // val 传过来的是布尔 遍历todos把传过来的布尔赋值给所有todos.done
    // 实现点击全选 所有子项目跟着改变
    this.todos.forEach(t => t.done = val)
  }

  // 删除任务
  RemoveTodo(index: number) {
    this.todos.splice(index, 1)
  }

  // 保存编辑
  saveEdit(todo, e) {
    this.currentEd = null
    todo.title = e.target.value
  }

  //取消编辑
  handleEdit(e) {
    const { keyCode, target } = e

    if (keyCode === 27) {
      target.value = this.currentEd.title
      this.currentEd = null
    }
  }

  // 计数
  get remaningCount() {
    return this.todos.filter(t => !t.done).length
  }

  // 清除所有已完成
  clearAlldone() {
    this.todos = this.todos.filter(t => !t.done)
  }


  // window事件要放在生命周期钩子中
  // ngOnInit:钩子函数 数据加载时
  ngOnInit() {
    this.hanshchangeHandler()
    window.onhashchange = this.hanshchangeHandler.bind(this)
  }

  // ngDoCheck钩子函数 数据改变时
  ngDoCheck() {
    window.localStorage.setItem('todos', JSON.stringify(this.todos))
  }

  hanshchangeHandler() {
    const hash = window.location.hash.substr(1)
    switch (hash) {
      case '/':
        this.visibility = 'all'
        break;
      case '/active':
        this.visibility = 'active'
        break;
      case '/completed':
        this.visibility = 'completed'
        break;
    }
  }

}


