import {
    Page,
    Layout,
    Card,
    SkeletonPage,
    SkeletonBodyText,
    SkeletonDisplayText,
    SkeletonThumbnail,
    Grid,
} from '@shopify/polaris';

const SkeletonPage = () => {
    const marginBtm = '30px';

    return (
        <SkeletonPage primaryAction secondaryActions={2}>
            <Layout>
                <Layout.AnnotatedSection title="General">
                    <Card sectioned>
                        <SkeletonBodyText/>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <SkeletonDisplayText size="small"/>
                            <SkeletonThumbnail size="medium"/>
                        </div>
                    </Card>
                </Layout.AnnotatedSection>

                <Layout.AnnotatedSection title="Orders">
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 6, lg: 6, xl: 6}}>
                            <Card sectioned>
                                <SkeletonDisplayText size="small"/>
                                <SkeletonBodyText/>
                            </Card>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 6, lg: 6, xl: 6}}>
                            <Card sectioned>
                                <SkeletonDisplayText size="small"/>
                                <SkeletonBodyText/>
                            </Card>
                        </Grid.Cell>
                    </Grid>
                </Layout.AnnotatedSection>

                <Layout.AnnotatedSection
                    title="Timing"
                    description="Control the flow of notifications by setting the loop option, initial delay, delay between notifications, and the duration each notification is displayed."
                >
                    <Card sectioned>
                        <SkeletonBodyText/>
                        <SkeletonBodyText/>
                        <SkeletonBodyText/>
                    </Card>
                </Layout.AnnotatedSection>

                <Layout.AnnotatedSection
                    title="Threshold"
                    description="Define limits with threshold settings, including selecting the type and specifying the threshold value."
                >
                    <Card sectioned>
                        <SkeletonBodyText/>
                        <SkeletonBodyText/>
                    </Card>
                </Layout.AnnotatedSection>

                <Layout.AnnotatedSection title="Appearance" description="Customize the notification's look.">
                    <Card sectioned>
                        <Grid>
                            <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 5, lg: 5, xl: 5}}>
                                <SkeletonBodyText/>
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{xs: 0, sm: 0, md: 1, lg: 1, xl: 1}}></Grid.Cell>
                            <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 6, lg: 6, xl: 6}}>
                                <SkeletonBodyText/>
                            </Grid.Cell>
                        </Grid>
                        <Grid>
                            <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 6, lg: 6, xl: 6}}>
                                <SkeletonBodyText/>
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 6, lg: 6, xl: 6}}>
                                <SkeletonBodyText/>
                            </Grid.Cell>
                        </Grid>
                        <SkeletonBodyText/>
                        <SkeletonBodyText/>
                    </Card>
                </Layout.AnnotatedSection>

                <Layout.AnnotatedSection
                    title="Preview"
                    description="View a live preview of how the notifications will appear with the current settings."
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundSize: '100%',
                            height: '328px',
                            marginBottom: '100px',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            backgroundColor: '#f4f6f8',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: '5px',
                                padding: '8px 12px',
                                lineHeight: '1.2em',
                                marginBottom: '5px',
                            }}
                        >
                            <SkeletonBodyText/>
                        </div>
                    </div>
                </Layout.AnnotatedSection>
            </Layout>
        </SkeletonPage>
    );
}

export default SkeletonPage;
