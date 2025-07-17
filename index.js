// << Import/Insert the AgGrid lib  here.>>
// << For readability purposes it has been removed.>>

export class AgGrid extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.gridOptions = {
      columnDefs: [],
      rowData: [],
    }
  }

  initialize(initialConfig, api) {
    this.config = initialConfig
    this.api = api

    this.renderGrid(this.shadowRoot, this.gridOptions)
    this.subscribeColumnDefs()
    this.subscribeData()
  }

  subscribeColumnDefs() {
    this.api.state.resolveByKey$(this.config.args.columnDefs).subscribe((columnDefs) => {
      this.gridOptions = {
        rowData: this.gridOptions.rowData,
        columnDefs: columnDefs.value || [],
      }
      this.updateGrid(this.gridOptions)
    })
  }

  subscribeData() {
    this.api.state.resolveByKey$(this.config.args.value).subscribe((rowData) => {
      this.gridOptions = {
        rowData: rowData.value || [],
        columnDefs: this.gridOptions.columnDefs,
      }
      this.updateGrid(this.gridOptions)
    })
  }

  updateGrid(gridOptions) {
    console.log('Updating AG Grid', gridOptions)
    this.gridApi.updateGridOptions(gridOptions)
  }

  async renderGrid(document, gridOptions) {
    console.log('Rendering AG Grid component', gridOptions)

    document.innerHTML = this.view()
    this.gridEl = document.querySelector('#myGrid')
    this.gridApi = agGrid.createGrid(this.gridEl, gridOptions)
    console.log('Created AG Grid', {
      document,
      gridOptions,
      gridEl: this.gridEl,
      gridApi: this.gridApi,
    })
  }

  view() {
    return `
      <div id="myGrid" style="height: 500px"></div>
    `
  }
}

export default AgGrid
