export default function MapDescription({ projectionContent }) {
  return (
    <>
      <div className="min-h-0 flex flex-col items-start px-4 lg:px-6 py-4 lg:py-6 gap-3 lg:gap-6 bg-bg">
        <h2>{projectionContent.name}</h2>

        {/* DESCRIPTION */}
        <p>
          The {projectionContent.name} projection was created in{" "}
          {projectionContent.year} by{" "}
          {projectionContent.creators.map((creator, index) => (
            <span key={creator.name}>
              {index > 0 && " and "}
              the {creator.nationality} {creator.profession} {creator.name}
            </span>
          ))}
          . It is {projectionContent.type} type of projection.
        </p>

        {/* FEATURES */}
        <div className="text-left flex flex-col gap-3">
          <h3>Features</h3>

          <ul className="list-disc pl-5 space-y-2 body-small">
            {projectionContent.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>

        {/* DRAWBACKS */}
        <div className="flex flex-col gap-3">
          <h3>Drawbacks</h3>

          <ul className="list-disc pl-5 space-y-2 body-small">
            {projectionContent.cons.map((con) => (
              <li key={con}>{con}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
