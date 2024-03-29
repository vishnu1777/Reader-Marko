import React from "react";
import html2canvas from "html2canvas";
import { useState, useEffect } from "react";
import DropZone from "./DropZone";
import { ExcelRenderer } from "react-excel-renderer";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import OutputTableSec from "./OutputTableSec";
import BarGraph from "./BarGraph";
import calculateLabData from "../../utils/calculateLabData";
import OutputLabTableSec from "./OutputLabTableSec";
import "jspdf-autotable";
import calculateLabTable2Data from "../../utils/CalculateLabTable2Data";
import { client } from "../../lib/client";
import data from "../../utils/getData";
import OutputTable from "./OutputTable";
import OutputTableThird from "./OutputTableThird";
import Calculate from "./Calculate";
import calculateTable2Data from "../../utils/calculateTable2Data";
import MainExcel from "./MainExcel";
import calculateUnitScores from "../../utils/CalculateExcelData";
import FileUploadCIE from "./FileUploadCIE";
import { FileStateContext } from "../../utils/Context";
import BarGraph2 from "./BarGraph2";
import OutputLabTableThird from "./OutputLabTableThird";
import BarLabGraph2 from "./BarLabGraph2";

const LabUpload = ({ courseCode }) => {
  const [Threshold, setThreshold] = useState(0);
  const [isFileUploaded, setisFileUploaded] = useState(false);
  const [isUploadedSEE, setIsUploadedSEE] = useState(false);
  const [setsaveThreshold, setSetsaveThreshold] = useState(Threshold);

  const [cols, setCols] = useState([]);
  const [rows, setRows] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [attainment, setAttainment] = useState([]);
  const [mappedData, setmappedData] = useState([]);
  const [marks, setMarks] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [AvgAttainent, setAvgAttainent] = useState([]);
  const [updatedTable2Data, setupdatedTable2Data] = useState([]);

  const { coMapping } = FileStateContext();

  //console.log("this is the first and the", coMapping);

  const readUploadFile = async (e) => {
    setisFileUploaded(true);
    let fileObj = e.target.files[0];

    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
        toast.error("Oops Something Went Wrong!");
      } else {
        const { rows, cols } = resp;
        cols.push({ name: "D", key: 3 });
        setRows(rows);
        setCols(cols);
        setIsUploaded(true);
        setIsUploadedSEE(true);
      }
    });
  };

  useEffect(() => {
    console.log("cource code is", courseCode);
    //setupdatedTable2Data(calculateTable2Data(AvgAttainent));
  }, [AvgAttainent, courseCode]);

  const uploadPDFToSanity = async (pdfFile) => {
    // Create a new Sanity document for the PDF
    const document = await client.create({
      _type: "docs", // Adjust the type name according to your Sanity schema
      // Add any other fields you want to store with the PDF document
    });

    // Upload the PDF file to Sanity's file storage
    const asset = await client.assets.upload("file", pdfFile, {
      filename: "output.pdf",
      contentType: "application/pdf",
      // Set any other metadata properties you need
    });

    // Associate the uploaded asset with the PDF document
    await client
      .patch(document._id)
      .set({
        doc: {
          _type: "file",
          asset: { _type: "reference", _ref: asset._id },
        },
        lectureName: {
          _type: "reference",
          _ref: localStorage.getItem("user"),
        },
      })
      .commit();
  };

  const generatePDF = async () => {
    const doc = new jsPDF();

    const pdfBlob = doc.output("blob");

    const addHeading = (heading) => {
      doc.setFontSize(16);
      const textWidth =
        (doc.getStringUnitWidth(heading) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const textOffset = (doc.internal.pageSize.getWidth() - textWidth) / 2;
      doc.text(heading, textOffset, 15);
    };

    const addHeading1 = (heading) => {
      doc.setFontSize(16);
      const textWidth =
        (doc.getStringUnitWidth(heading) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const textOffset = (doc.internal.pageSize.getWidth() - textWidth) / 2;
      doc.text(heading, textOffset, 140);
    };

    // addHeading("Table Given by the god");
    // doc.autoTable({
    //   head: [marks[0]], // Use the first row as table headers
    //   body: marks.slice(1), // Exclude the first row from table body
    //   startY: 20, // Set the initial y-coordinate for the table
    //   theme: "grid",

    //   styles: {
    //     fontSize: 12,
    //     cellPadding: 5,
    //     textColor: [1, 1, 0],
    //   },
    //   columnStyles: {
    //     // Add more column styles as needed
    //   },
    //   didDrawPage: function (marks) {
    //     const { table, pageNumber } = marks;
    //     const totalPages = doc.internal.getNumberOfPages();

    //     if (pageNumber === totalPages) {
    //       // Check if the table height exceeds the available space on the page
    //       if (table.height > doc.internal.pageSize.getHeight() - 20) {
    //         doc.addPage(); // Add a new page
    //         doc.autoTable({
    //           head: [marks[0]], // Repeat the table headers on the new page
    //           body: marks.slice(1), // Use the remaining body data
    //           startY: 20, // Set the initial y-coordinate for the table on the new page

    //           styles: {
    //             fontSize: 5,
    //             cellPadding: 10,
    //             textColor: [0, 0, 0],
    //           },
    //           columnStyles: {
    //             0: { cellWidth: "auto" },
    //             1: { cellWidth: "auto" },
    //             2: { cellWidth: "auto" },
    //             // Add more column styles as needed
    //           },
    //         });
    //       }
    //     }
    //   },
    // });

    // doc.addPage();

    addHeading("CO Attainment");
    doc.autoTable({
      head: [attainment[0]], // Use the first row as table headers
      body: attainment.slice(1), // Exclude the first row from table body
      startY: 20, // Set the initial y-coordinate for the table
      theme: "grid",

      styles: {
        fontSize: 12,
        cellPadding: 5,
        textColor: [1, 1, 0],
      },
      columnStyles: {
        // Add more column styles as needed
      },
      didDrawPage: function (attainment) {
        const { table, pageNumber } = attainment;
        const totalPages = doc.internal.getNumberOfPages();

        if (pageNumber === totalPages) {
          // Check if the table height exceeds the available space on the page
          if (table.height > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage(); // Add a new page
            doc.autoTable({
              head: [attainment[0]], // Repeat the table headers on the new page
              body: attainment.slice(1), // Use the remaining body data
              startY: 20, // Set the initial y-coordinate for the table on the new page

              styles: {
                fontSize: 5,
                cellPadding: 10,
                textColor: [0, 0, 0],
              },
              columnStyles: {
                0: { cellWidth: "auto" },
                1: { cellWidth: "auto" },
                2: { cellWidth: "auto" },
                // Add more column styles as needed
              },
            });
          }
        }
      },
    });

    //  doc.addPage();

    addHeading1("COs Attainment Graph");
    // Capture the graph element as an image
    const graphElement = document.getElementById("graph");
    const canvas = await html2canvas(graphElement);
    const imageData = canvas.toDataURL("image/png");

    // Calculate the PDF dimensions
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();

    // Calculate the image dimensions
    const imageWidth = pdfWidth - 10;
    const imageHeight = pdfHeight / 4 + 10;

    // Calculate the image position in the middle of the PDF
    const imageX = (pdfWidth - imageWidth) / 2;
    const imageY = 150;

    // Add the image to the PDF
    doc.addImage(imageData, "PNG", imageX, imageY, imageWidth, imageHeight);

    // Save the current transformation matrix
    doc.saveGraphicsState();

    doc.addPage();

    addHeading("CO-PO Attainment");
    doc.autoTable({
      head: [mappedData[0]], // Use the first row as table headers
      body: mappedData.slice(1), // Exclude the first row from table body
      startY: 20, // Set the initial y-coordinate for the table
      theme: "grid",

      styles: {
        fontSize: 7,
        cellPadding: 5,
        textColor: [1, 1, 0],
      },
      columnStyles: {
        // Add more column styles as needed
      },
      didDrawPage: function (mappedData) {
        const { table, pageNumber } = mappedData;
        const totalPages = doc.internal.getNumberOfPages();

        if (pageNumber === totalPages) {
          // Check if the table height exceeds the available space on the page
          if (table.height > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage(); // Add a new page
            doc.autoTable({
              head: [mappedData[0]], // Repeat the table headers on the new page
              body: mappedData.slice(1), // Use the remaining body data
              startY: 20, // Set the initial y-coordinate for the table on the new page

              styles: {
                fontSize: 2,
                cellPadding: 10,
                textColor: [0, 0, 0],
              },
              columnStyles: {
                0: { cellWidth: "auto" },
                1: { cellWidth: "auto" },
                2: { cellWidth: "auto" },
                // Add more column styles as needed
              },
            });
          }
        }
      },
    });

    doc.restoreGraphicsState();
    addHeading1("CO -> PO Attainment Graph");

    const graphElement1 = document.getElementById("graph1");
    const canvas1 = await html2canvas(graphElement1);
    const imageData1 = canvas1.toDataURL("image/png");

    doc.addImage(imageData1, "PNG", imageX, imageY, imageWidth, imageHeight);

    // Save the PDF
    const pdf = doc.output("blob");
    const pdfFile = new File([pdf], "output.pdf", {
      type: "application/pdf",
    });

    uploadPDFToSanity(pdfFile);

    doc.save("output.pdf");

    toast.success("Pdf Downloaded Successfully");
  };

  const handleClickUpdtae = () => {
    // console.log("from the hanle click", AvgAttainent);
    const table2Data = calculateLabTable2Data(
      AvgAttainent,
      coMapping,
      courseCode
    );
    // console.log("from the file upload", table2Data);

    setmappedData(table2Data);
    console.log("this is where we can find the mapped data", table2Data);
  };

  const handleChange = () => {
    setIsUploaded(true);
    setIsUpdated(true);

    const marksData = calculateLabData(rows);
    setMarks(marksData);

    console.log(
      "*************************************this is extra",
      marksData
    );

    //console.log("this is the SIE data", marksData);

    //console.log("the row data", rows);
    //console.log("this is the row CIE", rowsCIE);
  };

  return (
    <div className=" p-10 min-h-screen   overflow-hidden">
      <div className="flex flex-col md:flex-row gap-4 ">
        <div
          style={{ borderRadius: "9px" }}
          className="flex flex-col w-full mb-2 p-4 gap-2 max-w-4xl mx-auto border-4 border-dashed  items-center justify-around"
        >
          <p className="font-bold text-white text-xl  animate-bounce">
            Upload Lab File
          </p>

          <input
            className=" py-4 text-md w-[250px] md:w-[340px] font-semibold md:px-4 border-2 bg-gray-200 border-dotted "
            style={{ borderRadius: "10px" }}
            type="file"
            name="upload"
            id="upload"
            placeholder="Choose File"
            onChange={readUploadFile}
          />
        </div>
      </div>
      {isUploadedSEE && (
        <div className="mt-2">
          <OutputTable
            Threshold={Threshold}
            setsaveThreshold={setsaveThreshold}
            setThreshold={setThreshold}
            rows={rows}
            setIsUploaded={setIsUploaded}
            handleChange={handleChange}
            isUploaded={isUploaded}
          />
          <div className=" grid-cols-6 my-4 ">
            <div
              className={`${
                isUpdated && "border-2"
              }  border-white p-2 col-span-2 w-[295px] md:w-auto h-[200px] md:h-[350px] justify-center items-center `}
              id="graph"
            >
              <BarGraph
                attainment={attainment}
                isUpdated={isUpdated}
                courseCode={courseCode}
              />
            </div>

            <div className="flex flex-col gap-4  md:flex-row my-5">
              <div
                className={`${isUpdated && " border-2"} border-white  md:w-1/3`}
              >
                <OutputLabTableSec
                  handleChange={handleChange}
                  attainment={attainment}
                  setAttainment={setAttainment}
                  isUpdated={isUpdated}
                  marks={marks}
                  threshold={Threshold}
                  setAvgAttainent={setAvgAttainent}
                  courseCode={courseCode}
                />
              </div>

              <div
                className={`${isUpdated && "border-2"}  border-white md:w-2/3`}
              >
                <OutputLabTableThird
                  rows={rows}
                  setIsUploaded={setIsUploaded}
                  handleChange={handleChange}
                  mappedData={mappedData}
                  isUpdated={isUpdated}
                />
              </div>
            </div>
            <div
              className={`${
                isUpdated && "border-2"
              }  border-white p-2 col-span-2 w-[295px] md:w-auto h-[200px] md:h-[350px] justify-center items-center `}
              id="graph1"
            >
              <BarLabGraph2 mappedData={mappedData} isUpdated={isUpdated} />
            </div>
          </div>
          <div
            style={{ borderRadius: "10px" }}
            className="transition  duration-150 hover:scale-105 ease-in-out border-2 mx-auto mt-2 bg-red-400 text-white font-bold py-3  w-[200px] flex justify-end  px-6"
          >
            <button
              className="flex items-center justify-center mx-auto"
              onClick={handleClickUpdtae}
            >
              Update And Generate
            </button>
            <MainExcel />
            <button
              className="flex items-center justify-center mx-auto"
              onClick={generatePDF}
            >
              Generate PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabUpload;
