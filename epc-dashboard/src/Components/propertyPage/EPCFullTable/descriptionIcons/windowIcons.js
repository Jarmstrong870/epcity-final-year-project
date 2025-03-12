
export const windowEfficiency = (description) => {
    if (!description || description.toUpperCase() === 'NODATA!' || description === 'N/A')
      return;

    const windowDescriptions = [
        {"glazingDefinition": [
            "single glazed", "single glazeddobule glazing", "single glazedsecondary glazing", 
            "single glazedSingle glazing", "partial single glazing"
        ], rating: "🪟"}, 

        {"glazingDefinition": [
            "double glazed", "fully double glazed", "mostly double glazing", "some double glazing", "partial double glazing", "full secondary glazing",
            "fully secondary glazed", "high performance glazing|fffenestri perfformiad uchel", "fully double glazed|gwydrau dwbl llawn",
            "partial secondary glazing", "mostly secondary glazing", "secondary glazing"
        ], rating: "🪟🪟"},

        {"glazingDefinition": [
            "triple glazed", "fully triple glazed", "mostly triple glazing",
            "partial triple glazing", "some multiple glazing"
        ], rating: "🪟🪟🪟"},

        {"glazingDefinition": [
            "some secondary glazing", "high performance glazing", "multiple glazing throughout",
            "partial multiple glazing", "mostly multiple glazing", "multiple glazing throughout|gwydrau lluosog ym mhobman" 
        ], rating: "🪟⭐"}
    ];


    const windowDescription = description.toLowerCase();

    const match = windowDescriptions.find(glazingType =>
        glazingType.glazingDefinition.some(definition => windowDescription.includes(definition))
    );

        return match ? `${description} ${match.rating}` : `${description}`;
    };


