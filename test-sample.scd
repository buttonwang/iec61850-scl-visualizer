<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL" version="2007" revision="B" release="4">
  <Header id="TestSCL" version="1.0" revision="1" toolID="TestTool"/>
  <Substation name="TestSubstation" desc="测试变电站">
    <VoltageLevel name="VL1" desc="电压等级1">
      <Bay name="Bay1" desc="间隔1">
        <ConductingEquipment name="CB1" type="CBR" desc="断路器1"/>
        <ConductingEquipment name="DIS1" type="DIS" desc="隔离开关1"/>
      </Bay>
    </VoltageLevel>
  </Substation>
  <IED name="IED1" type="Protection" manufacturer="TestManufacturer" configVersion="1.0">
    <Services>
      <DynAssociation />
      <SettingGroups />
      <GetDirectory />
      <GetDataObjectDefinition />
      <DataObjectDirectory />
      <GetDataSetValue />
      <SetDataSetValue />
      <ReportSettings />
      <LogSettings />
      <GSESettings />
      <FileHandling />
    </Services>
    <AccessPoint name="AP1">
      <Server>
        <Authentication />
        <LDevice inst="LD0">
          <LN0 lnType="LLN0" lnClass="LLN0" inst="">
            <DataSet name="dsRelayDin" desc="保护装置数字量输入">
              <FCDA ldInst="LD0" prefix="" lnClass="GGIO" lnInst="1" doName="Ind" daName="stVal" fc="ST"/>
            </DataSet>
          </LN0>
          <LN lnType="GGIO" lnClass="GGIO" inst="1" prefix="">
            <DOI name="Ind">
              <DAI name="stVal">
                <Val>false</Val>
              </DAI>
            </DOI>
          </LN>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <DataTypeTemplates>
    <LNodeType id="LLN0" lnClass="LLN0">
      <DO name="Mod" type="myMod"/>
      <DO name="Beh" type="myBeh"/>
      <DO name="Health" type="myHealth"/>
      <DO name="NamPlt" type="myNamPlt"/>
    </LNodeType>
    <LNodeType id="GGIO" lnClass="GGIO">
      <DO name="Ind" type="myInd"/>
    </LNodeType>
    <DOType id="myMod" cdc="ENC">
      <DA name="stVal" bType="Enum" type="BehaviourModeKind"/>
      <DA name="q" bType="Quality"/>
      <DA name="t" bType="Timestamp"/>
    </DOType>
    <DOType id="myBeh" cdc="ENS">
      <DA name="stVal" bType="Enum" type="BehaviourModeKind"/>
      <DA name="q" bType="Quality"/>
      <DA name="t" bType="Timestamp"/>
    </DOType>
    <DOType id="myHealth" cdc="ENS">
      <DA name="stVal" bType="Enum" type="HealthKind"/>
      <DA name="q" bType="Quality"/>
      <DA name="t" bType="Timestamp"/>
    </DOType>
    <DOType id="myNamPlt" cdc="LPL">
      <DA name="vendor" bType="VisString255"/>
      <DA name="swRev" bType="VisString255"/>
      <DA name="d" bType="VisString255"/>
    </DOType>
    <DOType id="myInd" cdc="SPS">
      <DA name="stVal" bType="BOOLEAN"/>
      <DA name="q" bType="Quality"/>
      <DA name="t" bType="Timestamp"/>
    </DOType>
    <EnumType id="BehaviourModeKind">
      <EnumVal ord="1">on</EnumVal>
      <EnumVal ord="2">blocked</EnumVal>
      <EnumVal ord="3">test</EnumVal>
      <EnumVal ord="4">test/blocked</EnumVal>
      <EnumVal ord="5">off</EnumVal>
    </EnumType>
    <EnumType id="HealthKind">
      <EnumVal ord="1">Ok</EnumVal>
      <EnumVal ord="2">Warning</EnumVal>
      <EnumVal ord="3">Alarm</EnumVal>
    </EnumType>
  </DataTypeTemplates>
</SCL>