import { useEffect, useState } from 'react';
import { Accordion } from '@mui/material';
import { AccordionDetails } from '@mui/material';
import { AccordionSummary } from '@mui/material';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const numToGraph = {
  11: "Left Shoulder",
  12: "Right Shoulder",
  13: "Left Elbow",
  14: "Right Elbow",
  23: "Left Hip",
  24: "Right Hip",
  25: "Left Knee",
  26: "Right Knee",
  27: "Left Ankle",
  28: "Right Ankle",
}

export default function AngleDisplay(props) {
  const {graphs} = props;
  const [accordion, setAccordion] = useState(false);
  useEffect(() => {
    setAccordion(Object.keys(graphs).map((key, index) => {
      return (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
              <Typography>{numToGraph[key]}</Typography>
            </AccordionSummary>
            <AccordionDetails className='flex justify-center'>
              <img src={graphs[key]} alt="graph" className="w-[75%]" />
            </AccordionDetails>
          </Accordion>
      )}))
  }, [graphs])
  
  return (
    <div className='flex flex-col items-center p-4 justify-center md:w-2/3 rounded-md bg-white'>
      <h1 className="text-2xl font-bold">Angle Graphs</h1>
      <p className='pb-2'>For in depth analytics of every major angle over the course of the uploaded video use the dropdown below.
        Click on the dropdown to see the graph of the angle over time.
      </p>
      {accordion && accordion}
    </div>
  )
}