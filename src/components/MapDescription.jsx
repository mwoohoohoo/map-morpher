import Definition from "@/components/Definition";

// ------------------------------------------------------------
// Escape text so it can safely be used inside a RegExp
// ------------------------------------------------------------

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ------------------------------------------------------------
// Render text with optional annotations
// ------------------------------------------------------------

function AnnotatedText({ text, annotations = [] }) {
  // No annotations → render ordinary text
  if (!annotations.length) {
    return <>{text}</>;
  }

  // Sort longest terms first.
  //
  // This prevents a shorter term from matching inside a longer
  // annotated term.
  const sortedAnnotations = [...annotations].sort(
    (a, b) => b.term.length - a.term.length,
  );

  // Map term → annotation object
  const annotationMap = new Map(
    sortedAnnotations.map((annotation) => [annotation.term, annotation]),
  );

  // Build regex from the annotation terms
  const pattern = sortedAnnotations
    .map((annotation) => escapeRegExp(annotation.term))
    .join("|");

  const regex = new RegExp(`(${pattern})`, "g");

  // Split the sentence around the annotated terms
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        const annotation = annotationMap.get(part);

        // ------------------------------------------------------
        // Ordinary text
        // ------------------------------------------------------

        if (!annotation) {
          return <span key={index}>{part}</span>;
        }

        // ------------------------------------------------------
        // Tooltip / Popover definition
        // ------------------------------------------------------

        return (
          <Definition
            key={`${annotation.term}-${index}`}
            term={annotation.term}
            description={annotation.description}
          />
        );
      })}
    </>
  );
}

// ------------------------------------------------------------
// Map Description
// ------------------------------------------------------------

export default function MapDescription({ projectionContent }) {
  return (
    <div className="min-h-0 flex flex-col items-start px-4 lg:px-6 py-4 lg:py-6 gap-3 lg:gap-6 bg-bg">
      {/* ======================================================
          TITLE
      ====================================================== */}

      <h2>{projectionContent.name}</h2>

      {/* ======================================================
          DESCRIPTION
      ====================================================== */}

      <p>
        The {projectionContent.name} projection was created in{" "}
        {projectionContent.year} by{" "}
        {projectionContent.creators.map((creator, index) => (
          <span key={creator.name}>
            {index > 0 && " and "}
            the {creator.nationality} {creator.profession} {creator.name}
          </span>
        ))}
        . It is {projectionContent.type.article}{" "}
        <AnnotatedText
          text={projectionContent.type.text}
          annotations={projectionContent.type.annotations}
        />{" "}
        type of projection.
      </p>

      {/* ======================================================
          FEATURES
      ====================================================== */}

      <div className="text-left flex flex-col gap-3">
        <h3>Features</h3>

        <ul className="list-disc pl-5 space-y-2 body-small">
          {projectionContent.features.map((feature, index) => (
            <li key={index}>
              <AnnotatedText
                text={feature.text}
                annotations={feature.annotations}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* ======================================================
          DRAWBACKS
      ====================================================== */}

      <div className="flex flex-col gap-3">
        <h3>Drawbacks</h3>

        <ul className="list-disc pl-5 space-y-2 body-small">
          {projectionContent.cons.map((con, index) => (
            <li key={index}>
              <AnnotatedText text={con.text} annotations={con.annotations} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
