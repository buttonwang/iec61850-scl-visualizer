import { ParsedSCL } from '@/lib/scl-parser'

export interface SampleSCLFile {
  name: string
  type: 'cid' | 'icd' | 'scd'
  content: string
  description: string
}

export const sampleFiles: SampleSCLFile[] = [
  {
    name: '示例变电站.cid',
    type: 'cid',
    description: '包含一个简单变电站配置的示例文件',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL" version="2007" revision="B" release="4">
  <Header id="Example1" version="1.0" revision="1.0" toolID="SCLTool"/>
  <Substation name="Sub1" desc="示例变电站">
    <VoltageLevel name="VL1" desc="220kV电压等级" voltage="220000">
      <Bay name="Bay1" desc="220kV间隔1">
        <ConductingEquipment name="CB1" type="CBR" desc="断路器1"/>
        <ConductingEquipment name="DIS1" type="DIS" desc="隔离开关1"/>
        <ConductingEquipment name="VT1" type="VTR" desc="电压互感器1"/>
      </Bay>
      <Bay name="Bay2" desc="220kV间隔2">
        <ConductingEquipment name="CB2" type="CBR" desc="断路器2"/>
        <ConductingEquipment name="DIS2" type="DIS" desc="隔离开关2"/>
        <ConductingEquipment name="CT1" type="CTR" desc="电流互感器1"/>
      </Bay>
    </VoltageLevel>
    <VoltageLevel name="VL2" desc="110kV电压等级" voltage="110000">
      <Bay name="Bay3" desc="110kV间隔1">
        <ConductingEquipment name="CB3" type="CBR" desc="断路器3"/>
        <ConductingEquipment name="DIS3" type="DIS" desc="隔离开关3"/>
      </Bay>
    </VoltageLevel>
  </Substation>
  <IED name="IED1" type="Protection" manufacturer="ExampleCorp" configVersion="1.0">
    <AccessPoint name="AP1" desc="访问点1">
      <Server timeout="30">
        <LDevice inst="LD0" desc="逻辑设备0">
          <LN0 lnClass="LLN0" inst="" desc="逻辑节点0">
            <DataSet name="DS1" desc="数据集1">
              <FCDA ldInst="LD0" prefix="" lnClass="MMXU" lnInst="1" doName="TotW" daName="mag" fc="MX"/>
            </DataSet>
          </LN0>
          <LN lnClass="MMXU" inst="1" desc="测量单元1">
            <DOI name="TotW">
              <DAI name="mag">
                <Val>100.5</Val>
              </DAI>
            </DOI>
          </LN>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <DataTypeTemplates>
    <LNodeType id="MMXU1" lnClass="MMXU">
      <DO name="TotW" type="MV1"/>
    </LNodeType>
    <DOType id="MV1" cdc="MV">
      <DA name="mag" bType="Struct" type="AnalogValue1"/>
    </DOType>
  </DataTypeTemplates>
</SCL>`
  },
  {
    name: '示例IED.icd',
    type: 'icd',
    description: '单个IED设备的配置文件示例',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL" version="2007" revision="B" release="4">
  <Header id="IEDExample" version="1.0" revision="1.0" toolID="IEDTool"/>
  <IED name="ProtIED1" type="Protection" manufacturer="PowerTech" configVersion="2.1">
    <Services>
      <DynAssociation />
      <SettingGroups />
      <GetDirectory />
      <GetDataObjectDefinition />
      <DataObjectDirectory />
      <GetDataSetValue />
      <SetDataSetValue />
      <DataSetDirectory />
      <ConfDataSet modify="true" max="100" maxAttributes="2000"/>
      <DynDataSet />
      <ReadWrite />
      <TimerActivatedControl />
      <ConfReportControl max="50"/>
      <GetCBValues />
      <ConfLogControl max="10"/>
      <ReportSettings rptID="Conf" datSet="Conf" trgOps="Dyn" optFields="Conf" bufTime="Dyn" intgPd="Conf"/>
      <LogSettings logEna="Dyn" trgOps="Dyn" intgPd="Dyn"/>
      <GSESettings appID="Conf" dataLabel="Conf"/>
      <SMVSettings svID="Conf" optFields="Conf" smpRate="Conf" samples="Conf"/>
      <ConfLNs fixPrefix="true" fixLnInst="true"/>
    </Services>
    <AccessPoint name="S1" desc="站控层访问点">
      <Server timeout="30">
        <Authentication />
        <LDevice inst="PROT" desc="保护功能">
          <LN0 lnClass="LLN0" inst="" desc="逻辑节点0">
            <Mod stVal="on" />
            <Beh stVal="on" />
            <Health stVal="ok" />
            <NamPlt>
              <vendor>PowerTech</vendor>
              <swRev>2.1.0</swRev>
              <d>保护装置</d>
            </NamPlt>
          </LN0>
          <LN prefix="" lnClass="PTOC" inst="1" desc="过电流保护">
            <Mod stVal="on" />
            <Beh stVal="on" />
            <Health stVal="ok" />
            <Str>
              <setVal>100</setVal>
            </Str>
            <Op>
              <general>false</general>
            </Op>
          </LN>
          <LN prefix="" lnClass="PTOV" inst="1" desc="过电压保护">
            <Mod stVal="on" />
            <Beh stVal="on" />
            <Health stVal="ok" />
            <Str>
              <setVal>110</setVal>
            </Str>
          </LN>
        </LDevice>
        <LDevice inst="CTRL" desc="控制功能">
          <LN0 lnClass="LLN0" inst="" desc="逻辑节点0">
            <Mod stVal="on" />
            <Beh stVal="on" />
            <Health stVal="ok" />
          </LN0>
          <LN prefix="" lnClass="CSWI" inst="1" desc="开关控制">
            <Mod stVal="on" />
            <Beh stVal="on" />
            <Health stVal="ok" />
            <Pos stVal="off" q="00000000" t="2023-01-01T00:00:00Z" />
          </LN>
        </LDevice>
        <LDevice inst="MEAS" desc="测量功能">
          <LN0 lnClass="LLN0" inst="" desc="逻辑节点0">
            <Mod stVal="on" />
            <Beh stVal="on" />
            <Health stVal="ok" />
          </LN0>
          <LN prefix="" lnClass="MMXU" inst="1" desc="测量单元">
            <Mod stVal="on" />
            <Beh stVal="on" />
            <Health stVal="ok" />
            <TotW>
              <mag f="250.5"/>
              <q>00000000</q>
              <t>2023-01-01T00:00:00Z</t>
            </TotW>
            <TotVAr>
              <mag f="85.2"/>
              <q>00000000</q>
            </TotVAr>
          </LN>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <DataTypeTemplates>
    <LNodeType id="PTOC1" lnClass="PTOC">
      <DO name="Mod" type="Mod1"/>
      <DO name="Beh" type="Beh1"/>
      <DO name="Health" type="Health1"/>
      <DO name="Str" type="SPG1"/>
      <DO name="Op" type="ACT1"/>
    </LNodeType>
    <LNodeType id="PTOV1" lnClass="PTOV">
      <DO name="Mod" type="Mod1"/>
      <DO name="Beh" type="Beh1"/>
      <DO name="Health" type="Health1"/>
      <DO name="Str" type="SPG1"/>
    </LNodeType>
    <LNodeType id="CSWI1" lnClass="CSWI">
      <DO name="Mod" type="Mod1"/>
      <DO name="Beh" type="Beh1"/>
      <DO name="Health" type="Health1"/>
      <DO name="Pos" type="DPC1"/>
    </LNodeType>
    <LNodeType id="MMXU1" lnClass="MMXU">
      <DO name="Mod" type="Mod1"/>
      <DO name="Beh" type="Beh1"/>
      <DO name="Health" type="Health1"/>
      <DO name="TotW" type="MV1"/>
      <DO name="TotVAr" type="MV1"/>
    </LNodeType>
    <DOType id="Mod1" cdc="ENC">
      <DA name="stVal" bType="Enum" type="ModKind1" dU="模式"/>
      <DA name="q" bType="Quality" dU="质量"/>
      <DA name="t" bType="Timestamp" dU="时间"/>
    </DOType>
    <DOType id="Beh1" cdc="ENS">
      <DA name="stVal" bType="Enum" type="BehKind1" dU="行为"/>
      <DA name="q" bType="Quality" dU="质量"/>
      <DA name="t" bType="Timestamp" dU="时间"/>
    </DOType>
    <DOType id="Health1" cdc="ENS">
      <DA name="stVal" bType="Enum" type="HealthKind1" dU="健康状态"/>
      <DA name="q" bType="Quality" dU="质量"/>
      <DA name="t" bType="Timestamp" dU="时间"/>
    </DOType>
    <DOType id="SPG1" cdc="SPG">
      <DA name="setVal" bType="INT32U" dU="设定值"/>
    </DOType>
    <DOType id="ACT1" cdc="ACT">
      <DA name="general" bType="BOOLEAN" dU="总动作"/>
      <DA name="q" bType="Quality" dU="质量"/>
      <DA name="t" bType="Timestamp" dU="时间"/>
    </DOType>
    <DOType id="DPC1" cdc="DPC">
      <DA name="stVal" bType="Enum" type="DpcTyp1" dU="开关位置"/>
      <DA name="q" bType="Quality" dU="质量"/>
      <DA name="t" bType="Timestamp" dU="时间"/>
    </DOType>
    <DOType id="MV1" cdc="MV">
      <DA name="mag" bType="Struct" type="AnalogValue1" dU="幅值"/>
      <DA name="q" bType="Quality" dU="质量"/>
      <DA name="t" bType="Timestamp" dU="时间"/>
    </DOType>
    <DAType id="AnalogValue1">
      <BDA name="f" bType="FLOAT32" dU="浮点值"/>
    </DAType>
    <EnumType id="ModKind1">
      <EnumVal ord="1">on</EnumVal>
      <EnumVal ord="2">blocked</EnumVal>
      <EnumVal ord="3">test</EnumVal>
      <EnumVal ord="4">test/blocked</EnumVal>
      <EnumVal ord="5">off</EnumVal>
    </EnumType>
    <EnumType id="BehKind1">
      <EnumVal ord="1">on</EnumVal>
      <EnumVal ord="2">blocked</EnumVal>
      <EnumVal ord="3">test</EnumVal>
      <EnumVal ord="4">off</EnumVal>
    </EnumType>
    <EnumType id="HealthKind1">
      <EnumVal ord="1">ok</EnumVal>
      <EnumVal ord="2">warning</EnumVal>
      <EnumVal ord="3">alarm</EnumVal>
    </EnumType>
    <EnumType id="DpcTyp1">
      <EnumVal ord="0">intermediate-state</EnumVal>
      <EnumVal ord="1">off</EnumVal>
      <EnumVal ord="2">on</EnumVal>
      <EnumVal ord="3">bad-state</EnumVal>
    </EnumType>
  </DataTypeTemplates>
</SCL>`
  },
  {
    name: '示例系统.scd',
    type: 'scd',
    description: '完整的变电站系统配置描述文件',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL" version="2007" revision="B" release="4">
  <Header id="SystemExample" version="1.0" revision="1.0" toolID="SystemConfigTool"/>
  <Substation name="MainSub" desc="主变电站">
    <VoltageLevel name="VL500" desc="500kV电压等级" voltage="500000">
      <Bay name="Line1" desc="500kV线路1">
        <ConductingEquipment name="Q1" type="CBR" desc="500kV断路器1"/>
        <ConductingEquipment name="QS1" type="DIS" desc="500kV隔离开关1"/>
        <ConductingEquipment name="CVT1" type="VTR" desc="500kV电容式电压互感器1"/>
      </Bay>
      <Bay name="Transformer1" desc="500kV变压器1">
        <ConductingEquipment name="Q2" type="CBR" desc="500kV断路器2"/>
        <ConductingEquipment name="QS2" type="DIS" desc="500kV隔离开关2"/>
      </Bay>
    </VoltageLevel>
    <VoltageLevel name="VL220" desc="220kV电压等级" voltage="220000">
      <Bay name="Line2" desc="220kV线路1">
        <ConductingEquipment name="Q3" type="CBR" desc="220kV断路器3"/>
        <ConductingEquipment name="QS3" type="DIS" desc="220kV隔离开关3"/>
      </Bay>
      <Bay name="Bus1" desc="220kV母线1">
        <ConductingEquipment name="BUS1" type="BUS" desc="220kV母线"/>
      </Bay>
    </VoltageLevel>
  </Substation>
  <Communication>
    <SubNetwork name="StationBus" desc="站控层网络" type="8-MMS">
      <BitRate unit="b/s">100000000</BitRate>
      <ConnectedAP iedName="ProtIED1" apName="S1">
        <Address>
          <P type="IP">192.168.1.100</P>
          <P type="IP-SUBNET">255.255.255.0</P>
          <P type="IP-GATEWAY">192.168.1.1</P>
          <P type="OSI-AP-Title">1 3 9999 23</P>
          <P type="OSI-AE-Qualifier">23</P>
          <P type="OSI-PSEL">00000001</P>
          <P type="OSI-SSEL">0001</P>
          <P type="OSI-TSEL">0001</P>
        </Address>
        <GSE ldInst="CTRL" cbName="gcb1">
          <Address>
            <P type="MAC-Address">01-0C-CD-01-00-01</P>
            <P type="VLAN-ID">000</P>
            <P type="VLAN-PRIORITY">4</P>
            <P type="APPID">0001</P>
          </Address>
          <MinTime unit="s">0.002</MinTime>
          <MaxTime unit="s">0.05</MaxTime>
        </GSE>
        <SMV ldInst="MEAS" cbName="smvcb1">
          <Address>
            <P type="MAC-Address">01-0C-CD-04-00-01</P>
            <P type="VLAN-ID">001</P>
            <P type="VLAN-PRIORITY">4</P>
            <P type="APPID">4001</P>
          </Address>
        </SMV>
      </ConnectedAP>
    </SubNetwork>
  </Communication>
  <IED name="ProtIED1" type="Protection" manufacturer="PowerTech" configVersion="3.0">
    <AccessPoint name="S1" desc="站控层访问点">
      <Server timeout="30">
        <Authentication />
        <LDevice inst="PROT" desc="保护功能">
          <LN0 lnClass="LLN0" inst="" desc="逻辑节点0">
            <Mod stVal="on" />
            <Beh stVal="on" />
            <Health stVal="ok" />
            <NamPlt>
              <vendor>PowerTech</vendor>
              <swRev>3.0.0</swRev>
              <d>保护装置</d>
            </NamPlt>
          </LN0>
          <LN prefix="" lnClass="PTOC" inst="1" desc="过电流保护">
            <Mod stVal="on" />
            <Beh stVal="on" />
            <Health stVal="ok" />
            <Str>
              <setVal>150</setVal>
            </Str>
            <Op>
              <general>false</general>
            </Op>
          </LN>
          <LN prefix="" lnClass="PTOV" inst="1" desc="过电压保护">
            <Mod stVal="on" />
            <Beh stVal="on" />
            <Health stVal="ok" />
            <Str>
              <setVal>120</setVal>
            </Str>
          </LN>
          <LN prefix="" lnClass="PTUF" inst="1" desc="低频率保护">
            <Mod stVal="on" />
            <Beh stVal="on" />
            <Health stVal="ok" />
            <Str>
              <setVal>49.5</setVal>
            </Str>
          </LN>
        </LDevice>
        <LDevice inst="CTRL" desc="控制功能">
          <LN0 lnClass="LLN0" inst="" desc="逻辑节点0">
            <Mod stVal="on" />
            <Beh stVal="on" />
            <Health stVal="ok" />
          </LN0>
          <LN prefix="" lnClass="CSWI" inst="1" desc="开关控制1">
            <Mod stVal="on" />
            <Beh stVal="on" />
            <Health stVal="ok" />
            <Pos stVal="off" q="00000000" t="2023-01-01T00:00:00Z" />
          </LN>
          <LN prefix="" lnClass="CSWI" inst="2" desc="开关控制2">
            <Mod stVal="on" />
            <Beh stVal="on" />
            <Health stVal="ok" />
            <Pos stVal="off" q="00000000" t="2023-01-01T00:00:00Z" />
          </LN>
        </LDevice>
        <LDevice inst="MEAS" desc="测量功能">
          <LN0 lnClass="LLN0" inst="" desc="逻辑节点0">
            <Mod stVal="on" />
            <Beh stVal="on" />
            <Health stVal="ok" />
          </LN0>
          <LN prefix="" lnClass="MMXU" inst="1" desc="测量单元1">
            <Mod stVal="on" />
            <Beh stVal="on" />
            <Health stVal="ok" />
            <TotW>
              <mag f="350.8"/>
              <q>00000000</q>
              <t>2023-01-01T00:00:00Z</t>
            </TotW>
            <TotVAr>
              <mag f="125.3"/>
              <q>00000000</q>
            </TotVAr>
            <PPV phsA="1" phsB="2">
              <mag f="220.5"/>
              <q>00000000</q>
            </PPV>
          </LN>
          <LN prefix="" lnClass="MSQI" inst="1" desc="序列分量1">
            <Mod stVal="on" />
            <Beh stVal="on" />
            <Health stVal="ok" />
            <SeqA>
              <c1>
                <mag f="350.8"/>
                <ang f="0.0"/>
              </c1>
              <c2>
                <mag f="15.2"/>
                <ang f="-120.0"/>
              </c2>
              <c3>
                <mag f="8.5"/>
                <ang f="120.0"/>
              </c3>
            </SeqA>
          </LN>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <DataTypeTemplates>
    <LNodeType id="LLN01" lnClass="LLN0">
      <DO name="Mod" type="Mod1"/>
      <DO name="Beh" type="Beh1"/>
      <DO name="Health" type="Health1"/>
      <DO name="NamPlt" type="LPL1"/>
    </LNodeType>
    <LNodeType id="PTOC1" lnClass="PTOC">
      <DO name="Mod" type="Mod1"/>
      <DO name="Beh" type="Beh1"/>
      <DO name="Health" type="Health1"/>
      <DO name="Str" type="SPG1"/>
      <DO name="Op" type="ACT1"/>
    </LNodeType>
    <LNodeType id="PTOV1" lnClass="PTOV">
      <DO name="Mod" type="Mod1"/>
      <DO name="Beh" type="Beh1"/>
      <DO name="Health" type="Health1"/>
      <DO name="Str" type="SPG1"/>
    </LNodeType>
    <LNodeType id="PTUF1" lnClass="PTUF">
      <DO name="Mod" type="Mod1"/>
      <DO name="Beh" type="Beh1"/>
      <DO name="Health" type="Health1"/>
      <DO name="Str" type="SPG1"/>
    </LNodeType>
    <LNodeType id="CSWI1" lnClass="CSWI">
      <DO name="Mod" type="Mod1"/>
      <DO name="Beh" type="Beh1"/>
      <DO name="Health" type="Health1"/>
      <DO name="Pos" type="DPC1"/>
    </LNodeType>
    <LNodeType id="MMXU1" lnClass="MMXU">
      <DO name="Mod" type="Mod1"/>
      <DO name="Beh" type="Beh1"/>
      <DO name="Health" type="Health1"/>
      <DO name="TotW" type="MV1"/>
      <DO name="TotVAr" type="MV1"/>
      <DO name="PPV" type="CMV1"/>
    </LNodeType>
    <LNodeType id="MSQI1" lnClass="MSQI">
      <DO name="Mod" type="Mod1"/>
      <DO name="Beh" type="Beh1"/>
      <DO name="Health" type="Health1"/>
      <DO name="SeqA" type="SAV1"/>
    </LNodeType>
  </DataTypeTemplates>
</SCL>`
  }
]

export const downloadSampleFile = (file: SampleSCLFile) => {
  const blob = new Blob([file.content], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}