import xml2js from 'xml2js'

export interface SCLFile {
  header?: any
  substation?: any
  communication?: any
  ied?: any[]
  dataTypeTemplates?: any
}

export interface ParsedSCL {
  fileName: string
  version: string
  header: any
  substations: any[]
  ieds: any[]
  communications: any[]
  dataTypes: any
  structure: any
}

export class SCLParser {
  private parser: xml2js.Parser

  constructor() {
    this.parser = new xml2js.Parser({
      explicitArray: false,
      ignoreAttrs: false,
      mergeAttrs: true,
      explicitCharkey: true,
    })
  }

  async parseSCLFile(fileContent: string, fileName: string): Promise<ParsedSCL> {
    try {
      const result = await this.parser.parseStringPromise(fileContent)
      const scl = result.SCL || result

      return {
        fileName,
        version: scl.version || 'Unknown',
        header: this.parseHeader(scl.Header),
        substations: this.parseSubstations(scl.Substation),
        ieds: this.parseIEDs(scl.IED),
        communications: this.parseCommunications(scl.Communication),
        dataTypes: this.parseDataTypes(scl.DataTypeTemplates),
        structure: scl,
      }
    } catch (error) {
      throw new Error(`SCL文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  private parseHeader(header: any): any {
    if (!header) return null
    return {
      id: header.id || '',
      version: header.version || '',
      revision: header.revision || '',
      toolID: header.toolID || '',
      nameStructure: header.nameStructure || '',
    }
  }

  private parseSubstations(substations: any | any[]): any[] {
    if (!substations) return []
    const substationArray = Array.isArray(substations) ? substations : [substations]
    
    return substationArray.map((substation: any) => ({
      name: substation.name || '',
      desc: substation.desc || '',
      voltageLevel: this.parseVoltageLevels(substation.VoltageLevel),
      bays: this.parseBays(substation.Bay),
    }))
  }

  private parseVoltageLevels(voltageLevels: any | any[]): any[] {
    if (!voltageLevels) return []
    const voltageArray = Array.isArray(voltageLevels) ? voltageLevels : [voltageLevels]
    
    return voltageArray.map((vl: any) => ({
      name: vl.name || '',
      desc: vl.desc || '',
      voltage: vl.voltage || '',
      bays: this.parseBays(vl.Bay),
    }))
  }

  private parseBays(bays: any | any[]): any[] {
    if (!bays) return []
    const bayArray = Array.isArray(bays) ? bays : [bays]
    
    return bayArray.map((bay: any) => ({
      name: bay.name || '',
      desc: bay.desc || '',
      devices: this.parseConductingEquipment(bay.ConductingEquipment),
    }))
  }

  private parseConductingEquipment(equipment: any | any[]): any[] {
    if (!equipment) return []
    const equipmentArray = Array.isArray(equipment) ? equipment : [equipment]
    
    return equipmentArray.map((eq: any) => ({
      name: eq.name || '',
      type: eq.type || '',
      desc: eq.desc || '',
    }))
  }

  private parseIEDs(ieds: any | any[]): any[] {
    if (!ieds) return []
    const iedArray = Array.isArray(ieds) ? ieds : [ieds]
    
    return iedArray.map((ied: any) => ({
      name: ied.name || '',
      type: ied.type || '',
      manufacturer: ied.manufacturer || '',
      configVersion: ied.configVersion || '',
      accessPoints: this.parseAccessPoints(ied.AccessPoint),
    }))
  }

  private parseAccessPoints(accessPoints: any | any[]): any[] {
    if (!accessPoints) return []
    const apArray = Array.isArray(accessPoints) ? accessPoints : [accessPoints]
    
    return apArray.map((ap: any) => ({
      name: ap.name || '',
      desc: ap.desc || '',
      server: this.parseServer(ap.Server),
    }))
  }

  private parseServer(server: any): any {
    if (!server) return null
    return {
      timeout: server.timeout || '',
      ld: this.parseLogicalDevices(server.LDevice),
    }
  }

  private parseLogicalDevices(devices: any | any[]): any[] {
    if (!devices) return []
    const deviceArray = Array.isArray(devices) ? devices : [devices]
    
    return deviceArray.map((ld: any) => ({
      inst: ld.inst || '',
      desc: ld.desc || '',
      lnodes: this.parseLogicalNodes(ld.LN0 || ld.LN),
    }))
  }

  private parseLogicalNodes(nodes: any | any[]): any[] {
    if (!nodes) return []
    const nodeArray = Array.isArray(nodes) ? nodes : [nodes]
    
    return nodeArray.map((ln: any) => ({
      prefix: ln.prefix || '',
      lnClass: ln.lnClass || '',
      inst: ln.inst || '',
      desc: ln.desc || '',
    }))
  }

  private parseCommunications(communications: any): any[] {
    if (!communications) return []
    return [communications] // 简化处理
  }

  private parseDataTypes(dataTypes: any): any {
    if (!dataTypes) return {}
    return dataTypes
  }

  validateSCLFile(fileContent: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    try {
      // 基本XML结构验证
      if (!fileContent.includes('<SCL')) {
        errors.push('缺少根元素<SCL>')
      }
      
      if (!fileContent.includes('xmlns="http://www.iec.ch/61850/2003/SCL"')) {
        errors.push('缺少正确的IEC 61850命名空间')
      }

      // 尝试解析XML
      this.parser.parseString(fileContent, (err: any, result: any) => {
        if (err) {
          errors.push(`XML解析错误: ${err.message}`)
        }
      })

      return {
        isValid: errors.length === 0,
        errors
      }
    } catch (error) {
      return {
        isValid: false,
        errors: [...errors, `文件验证失败: ${error instanceof Error ? error.message : '未知错误'}`]
      }
    }
  }
}